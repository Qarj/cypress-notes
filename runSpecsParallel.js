const version = '1.3.14';

const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const { v4 } = require('uuid');

function countKeys(obj) {
    var count = 0;
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            ++count;
        }
    }
    return count;
}

function generateNewId() {
    return v4().substring(0, 8);
}

function getSpecsRecursive(folder) {
    fs.readdirSync(folder).forEach((file) => {
        const filePath = path.join(folder, file);
        if (fs.statSync(filePath).isDirectory()) return getSpecsRecursive(filePath);
        else return specs.push(filePath);
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function outputStartupInfo() {
    console.log(`\nParallel Spec Runner version ${version}`);
    console.log(`\nRunning tests for ${project_name} on branch ${project_branch} version ${project_version}`);
    console.log(`Running tests for ${envSpecific} environment`);
    console.log(`Running tests in parallel with ${maxParallel} maximum parallelism\n`);
}

function setMaxParallel() {
    maxParallel = getMaxParallel();
}

function getMaxParallel() {
    let baseThreads = 1;
    const threadsMultiplier = runConfig.threadsMultiplier || 1;
    if (isWindows) baseThreads = 3; // Cypress startup performs very poorly on Windows
    // Cypress performs very well on ARM64 after building own binary: https://github.com/cypress-io/cypress/issues/19908
    if (isMac) baseThreads = shell.exec('sysctl -n hw.ncpu').trim();
    if (isLinux) baseThreads = shell.exec('grep -c ^processor /proc/cpuinfo').trim();
    return Math.ceil(baseThreads * threadsMultiplier);
}

function setReleaseTestsVersion() {
    const package = fs.readJSONSync('./package.json');
    releaseTestsVersion = package.version;
    console.log(`Release tests package version ${releaseTestsVersion}`);
}

function generateReport() {
    const count = countKeys(pending);
    if (count > 0) {
        console.log(`Still running tests, ${count} pending, ${countKeys(done)} done:`);
        for (const key in pending) {
            let state = 'queued';
            if (key in running) state = 'running';
            console.log(`    ${state} -- ${pending[key]}`);
        }
        return buildReports('INTERIM');
    }
    console.log('All tests completed, building reports.');
    buildReports('FINAL');
}

function buildReports(status) {
    if (status === 'INTERIM') {
        const now = new Date();
        const diff = now.getTime() - lastInterimReportDate.getTime();
        const diffSeconds = Math.round(((diff % 86400000) % 3600000) / 1000); // %86400000 to ignore the time difference between days
        if (diffSeconds > 5) lastInterimReportDate = now;
        else return;
    }
    let reportsToMerge = '';
    for (const key in done) {
        const reportPath = `./${reportsRunFolder}/${key}/mochawesome.json`;
        console.log(reportPath);
        reportsToMerge += ` ${reportPath}`;
    }
    shell.exec(`npx mochawesome-merge ${reportsToMerge} -o ./${reportsRunFolder}/mochawesome-merged.json`);

    for (const key in done) {
        const reportPath = `./${reportsRunFolder}/${key}/results*.xml`;
        shell.exec(`cp ${reportPath} ./${reportsRunFolder}`);
    }

    const utc = new Date().toUTCString();

    shell.exec(`npx marge --reportTitle "${status} ${project_name} Release Tests on branch ${project_branch}; ${utc}; ${project_version}; env ${envSpecific}" \
  --reportPageTitle "${project_name} ${envSpecific}" \
  --autoOpen false \
  --charts true \
  --code true \
  --inline true \
  --reportDir ${reportsRunFolder} \
  --reportFilename mochawesome \
  ${reportsRunFolder}/mochawesome-merged.json`);

    const reportsPublishFolder = `./test-reports-${envSpecific}`;
    console.log(`Copying reports to local publish folder ${reportsPublishFolder}`);
    fs.emptyDirSync(reportsPublishFolder);
    shell.exec(`cp -r ${reportsRunFolder}/* ${reportsPublishFolder}/`);

    console.log(`Copying reports to Bamboo publish folder ${reportsPublishFolder}`);
    const reportsBambooPublishFolder = 'test-reports';
    fs.emptyDirSync(reportsBambooPublishFolder);
    shell.exec(`cp -r ${reportsRunFolder}/* ${reportsBambooPublishFolder}/`);

    for (const id in runAgain) {
        const cypressFlake = runAgain[id];
        console.log(`Ran spec ${cypressFlake.spec} ${cypressFlake.failedCount} additional times due to Cypress flakes.`);
    }

    const relativeReportPath = `${reportsPublishFolder}/mochawesome.html`;
    const absoluteReportPath = path.resolve(relativeReportPath);
    console.log(`Mochawesome report for ${envSpecific} at file://${absoluteReportPath}`);
}

function setProjectVariables() {
    console.log('\nSetting project variables.');
    if (process.env.running_on_bamboo) {
        project_name = process.env.bamboo_repository_name;
        project_branch = process.env.bamboo_repository_branch_name;
    } else {
        const projectPath = shell.exec('git rev-parse --show-toplevel').trim(); // 2 steps for Windows compatibility
        project_name = shell.exec(`basename ${projectPath}`).trim();
        project_branch = shell.exec('git rev-parse --abbrev-ref HEAD').trim();
    }

    const appPackagePath = '../../package.json';
    if (fs.pathExistsSync(appPackagePath)) {
        const package = fs.readJSONSync('../../package.json');
        project_version = package.version;
    }
}

function determineAndSetEnvironmentVars() {
    envLevel = determineEnvironmentLevel();
    envSpecific = determineEnvironmentSpecificName();
    console.log(`Determined environment level as ${envLevel}`);
    console.log(`Determined specific environment as ${envSpecific}`);
}

function determineEnvironmentLevel() {
    // bamboo_deployment_environmentName should exist so long as release tests were triggered automatically
    if ('bamboo_deployment_environmentName' in process.env) {
        for (const env of runConfig.deploymentEnvironments) {
            if (process.env.bamboo_deployment_environmentName.toLocaleLowerCase().includes(env)) return env;
        }
    }

    if ('bamboo_target_environment' in process.env) {
        for (const env of runConfig.targetEnvironments) {
            if (process.env.bamboo_target_environment.toLocaleLowerCase().includes(env)) return env;
        }

        if (process.env.bamboo_target_environment.length > 0) return process.env.bamboo_target_environment;
    }

    // for a manual run - it has no way of knowing what environment you intend, so we default to dev
    return 'dev';
}

function determineEnvironmentSpecificName() {
    // only dev has team sub environments
    for (const env of runConfig.nonDevEnvironments) {
        if (envLevel === env) return env;
    }

    if ('bamboo_team_name' in process.env) {
        if (process.env.bamboo_team_name.length > 0) return process.env.bamboo_team_name;
    }

    return runConfig.defaultTeamName;
}

function generateCypressConfig() {
    process.env.cypress_config = `cypress/cypress-${envSpecific}.json`;
    if (envLevel === 'dev') {
        shell.exec(`node generateCypressDevConfig.js ${envSpecific} ${reportsRunFolder}`);
        process.env.cypress_config = `${reportsRunFolder}/cypress-${envSpecific}-generated.json`;
    }
}

function setPending(spec) {
    const id = generateNewId();
    pending[id] = spec;
    processed.push(spec);
    return id;
}

function completeRun(id, spec) {
    delete pending[id];
    delete running[id];
    done[id] = spec;
    placeReportFailedTemplatesIfThereIsNoReportPresent(id, spec);
}

function placeReportFailedTemplatesIfThereIsNoReportPresent(id, spec) {
    const outputFolder = getOutputFolder(id);
    if (fs.existsSync(`${outputFolder}/mochawesome.json`)) return;

    let mochawesome = fs.readFileSync('./runnerTemplates/mochawesome-crash-template.json', { encoding: 'utf8' });
    mochawesome = mochawesome.replaceAll('UnknownSpec', spec);
    mochawesome = mochawesome.replaceAll('no code available', `spec working folder: ${outputFolder}`);
    fs.writeFileSync(`${outputFolder}/mochawesome.json`, mochawesome, {
        encoding: 'utf8',
    });

    let junit = fs.readFileSync('./runnerTemplates/junit-crash-template.xml', {
        encoding: 'utf8',
    });
    junit = junit.replaceAll('UnknownSpec', spec);
    fs.writeFileSync(`${outputFolder}/results-ff1f501ff803f8e9561ed5c22456ed7a.xml`, junit, { encoding: 'utf8' });
}

function prefixRoot(specRelative) {
    return path.normalize(`${specsRoot}/${specRelative}`);
}

function runPreconditionSync(specRelative) {
    const spec = prefixRoot(specRelative);
    const id = setPending(spec);
    const result = runTest(id, spec);
    completeRun(id, spec);
    if (result.code) preconditionFailure(spec);
}

function preconditionFailure(spec) {
    console.log(`Precondition spec ${spec} failed, exiting.`);
    generateReport();
    process.exit(1);
}

async function startRemainingParallel() {
    console.log('\nDetermining which specs to start parallel:');
    for (let i = 0; i < processed.length; i++) {
        const spec = processed[i];
        console.log(`  ${spec} already processed.`);
    }
    for (let i = 0; i < specs.length; i++) {
        const spec = specs[i];
        if (!processed.includes(spec)) console.log(`  ${spec} queued for ${envSpecific} parallel.`);
    }
    console.log();

    for (let i = 0; i < specs.length; i++) {
        const spec = specs[i];
        if (!processed.includes(spec)) await startParallel(spec);
    }
}

async function startParallel(spec) {
    const id = setPending(spec);
    if (currentParallel < maxParallel) {
        currentParallel++;
        runTest(id, spec, handleParallelCompletion);
        let sleepMilliseconds = 2000;
        if (isWindows) sleepMilliseconds = 8000; // Windows really chokes starting Cypress
        await sleep(sleepMilliseconds); // Cypress appears to have race conditions when kicking off tests in parallel, so give it a chance to get through unsafe startup
        return;
    }
    console.log(`Throttling spec ${spec} due to max parallel limit of ${maxParallel}, ${envSpecific}.`);
    parallelQueue[id] = spec;
}

const handleParallelCompletion = function (code, stdout, stderr) {
    console.log(`Parallel spec ${this.spec} finished with exit code ${code}, ${envSpecific}.`);
    const lastId = this.id;
    const lastSpec = this.spec;
    if (specContainsNoTests(stdout)) {
        console.log(`Detected that ${lastSpec} contains no tests!`);
        console.log('This is not a flaky Cypress result, please remove spec.');
        pending[lastId];
    } else {
        if (isFlakyCypressResult(stdout)) return runTestAgain(lastId, lastSpec, handleParallelCompletion);
        completeRun(lastId, lastSpec);
    }
    if (countKeys(parallelQueue) > 0) {
        for (const id in parallelQueue) {
            const spec = parallelQueue[id];
            delete parallelQueue[id];
            console.log(`Starting spec ${spec} with id ${id} throttled by core count now, ${envSpecific}.`);
            runTest(id, spec, handleParallelCompletion);
            return;
        }
    }
    currentParallel--;
    generateReport();
};

function specContainsNoTests(stdout) {
    if (stdout.includes("Cannot read property 'results' of undefined")) {
        console.log('Flaky Cypress behaviour detected - false claim "is not a function".');
        return true;
    }
    return false;
}

function isFlakyCypressResult(stdout) {
    // not to be confused with flaky tests (due to test design or environmental issues)
    if (stdout.includes('Cypress could not associate this error')) {
        console.log('Flaky Cypress behaviour detected - Cypress could not associate this error.');
        return true;
    }
    if (stdout.includes('Cannot find module')) {
        console.log('Flaky Cypress behaviour detected - false claim "Cannot find module".');
        return true;
    }
    if (stdout.includes(' is not a function')) {
        console.log('Flaky Cypress behaviour detected - false claim "is not a function".');
        return true;
    }
    if (stdout.includes('Invalid or unexpected token')) {
        console.log('Flaky Cypress behaviour detected - unexpected token - happens on Windows.');
        return true;
    }
    if (stdout.includes('Unexpected end of input')) {
        console.log('Flaky Cypress behaviour detected - unexpected end of input - happens on Windows.');
        return true;
    }
    if (stdout.includes('Fatal IO error')) {
        console.log(
            'Flaky Cypress behaviour detected - Fatal IO error, for example - Cypress: Fatal IO error 11 (Resource temporarily unavailable) on X server.',
        );
        return true;
    }
    if (stdout.includes('Test Runner unexpectedly exited')) {
        console.log('Flaky Cypress behaviour detected - Test Runner unexpectedly exited.');
        return true;
    }
    if (stdout.includes('uncaught error was detected')) {
        console.log('Flaky Cypress behaviour detected - uncaught error was detected.');
        return true;
    }
    if (stdout.includes('X connection error')) {
        console.log('Flaky Docker behaviour detected - X connection error - happens on Ubuntu Docker');
        return true;
    }

    return false;
}

function runTestAgain(id, spec, callback) {
    // due to Cypress flake
    let cypressFlake = { spec, failedCount: 0 };
    if (id in runAgain) {
        cypressFlake = runAgain[id];
    }
    cypressFlake.failedCount++;
    runAgain[id] = cypressFlake;

    if (cypressFlake.failedCount > 5) {
        console.log(`${spec} has failed too many times due to Cypress flakes, giving up.`);
        completeRun(id, spec);
        return generateReport();
    }

    const attempt = cypressFlake.failedCount + 1;
    console.log(`Running ${spec} with ${id} again, attempt ${attempt}, ${envSpecific}.`);
    runTest(id, spec, callback);
}

function queueSerial(specRelative) {
    const spec = prefixRoot(specRelative);
    const id = setPending(spec);
    serialQueue[id] = spec;
}

function startQueuedSerial() {
    if (countKeys(serialQueue) > 0) console.log(`Running these ${countKeys(serialQueue)} specs as serial now:`);
    else return;

    for (const id in serialQueue) {
        const spec = serialQueue[id];
        console.log(`  ${spec} with id ${id} is in the serial queue, ${envSpecific}.`);
    }
    console.log();
    runNextSerial(-1, '', '');
}

const runNextSerial = function (code, stdout, stderr) {
    if (this.id) {
        const lastId = this.id;
        const lastSpec = this.spec;
        console.log(`Completed serial run of spec ${lastSpec} with exit code ${code}, ${envSpecific}.`);
        if (isFlakyCypressResult(stdout)) return runTestAgain(lastId, lastSpec, runNextSerial);
        completeRun(lastId, lastSpec);
        delete serialQueue[lastId];
    }
    for (const id in serialQueue) {
        const spec = serialQueue[id];
        console.log(`Running spec ${spec} with id ${id} serial now, ${envSpecific}.`);
        runTest(id, spec, runNextSerial);
        break;
    }
    generateReport();
};

function runTest(id, spec, callback) {
    const outputFolder = getOutputFolder(id);
    fs.emptyDirSync(outputFolder);

    const reportConfigPath = `./${reportsRunFolder}/${id}-reporter-config.json`;
    const reportConfig = {
        specName: spec,
        reporterEnabled: 'mocha-junit-reporter, mochawesome',
        mochaJunitReporterReporterOptions: {
            mochaFile: `${outputFolder}/results-[hash].xml`,
        },
        reporterOptions: {
            reportDir: outputFolder,
            overwrite: false,
            html: false,
            json: true,
        },
    };
    fs.writeJsonSync(reportConfigPath, reportConfig, { spaces: 4 });

    const runCommand = `npx cypress run \
  --config screenshotsFolder=${outputFolder} \
  --config-file ${process.env.cypress_config} \
  --spec ${spec} \
  --reporter cypress-multi-reporters \
  --reporter-options configFile="${reportConfigPath}"
`;

    console.log(`About to call shell.exec for spec ${spec}, ${envSpecific}.`);
    running[id] = spec;
    let result;
    if (callback) {
        result = shell.exec(runCommand, callback.bind({ id, spec }));
    } else {
        result = shell.exec(runCommand);
    }
    console.log(`Have just called shell.exec for spec ${spec}, ${envSpecific}.`);
    return result;
}

function getOutputFolder(id) {
    return `./${reportsRunFolder}/${id}`;
}

function logSpecsToRun() {
    console.log(`\nThe following ${specs.length} specs will be run:`);
    for (let i = 0; i < specs.length; i++) {
        console.log('  ' + specs[i]);
    }
}

function startSpecs() {
    for (let i = 0; i < runConfig.precondition.length; i++) {
        runPreconditionSync(runConfig.precondition[i]);
    }
    console.log('All pre-conditions met (if any were specified in spec-run-config.json).');

    for (let i = 0; i < runConfig.serial.length; i++) {
        queueSerial(runConfig.serial[i]);
    }
    console.log('Specs to run serial are now queued (if any were specified in spec-run-config.json).');

    startQueuedSerial();

    startRemainingParallel();

    console.log('All tests kicked off.');
}

function setSpecsRoot() {
    console.log('Current working directory for runSpecsParallel.js:', __dirname);
    const args = process.argv.slice(2);
    specsRoot = args.length > 0 ? args[0] : '';
    if (specsRoot.length === 0) {
        console.log('Please provide the specs root folder, e.g. cypress/integration');
        process.exit(1);
    }
    specsRoot = path.normalize(specsRoot);
    console.log(`Specs root is ${specsRoot}`);
}

function loadRunConfig() {
    runConfig = fs.readJsonSync('spec-run-config.json');
}

function checkDependencies() {
    const dependencies = [
        { dep: 'generateCypressDevConfig.js', err: '' },
        { dep: 'runnerTemplates/junit-crash-template.xml', err: '' },
        { dep: 'runnerTemplates/mochawesome-crash-template.json', err: '' },
        { dep: 'spec-run-config.json', err: '' },
    ];
    let fails = [];
    for (let i = 0; i < dependencies.length; i++) {
        const dep = dependencies[i];
        if (!dep.err) {
            dep.err = `${dep.dep} not found`;
            dep.dep = `ls ${dep.dep}`;
        }
        if (shell.exec(dep.dep, { silent: true }).code !== 0) {
            fails.push(dep.err);
        }
    }
    if (fails.length > 0) {
        console.log('\nThe following dependencies failed:');
        for (let i = 0; i < fails.length; i++) {
            console.log('  ' + fails[i]);
        }
        process.exit(1);
    }
}

function checkEndpointsReachable() {
    if (!runConfig.checkEndpointsReachable)
        return console.log('Skipping endpoint check, checkEndpointsReachable is false or not present.');
    if (isWindows) return console.log('Skipping endpoint check, Windows not supported.');
    console.log('Checking endpoints are reachable...');
    cypressConfig = fs.readJsonSync(process.env.cypress_config);
    setUniqueEndpoints(cypressConfig);
    console.log('Found these endpoints:');
    for (const endpoint of endpoints) console.log(`  ${endpoint}`);
    for (const endpoint of endpoints) checkEndpointReachable(endpoint);
    if (unreachableEndpoints.length > 0) {
        console.log('The following endpoints are not reachable on port 443:');
        for (const endpoint of unreachableEndpoints) console.log(`  ${endpoint}`);
    } else {
        console.log('All endpoints are reachable on port 443.');
    }
}

function checkEndpointReachable(endpoint) {
    let timeout = '-w 1';
    if (isMac) timeout = '--apple-tcp-timeout 1';
    const stdout = shell.exec(`nc -zv ${endpoint} 443 ${timeout}`);
    if (stdout.code !== 0) unreachableEndpoints.push(endpoint);
}

function setUniqueEndpoints(configLevel) {
    for (const key in configLevel) {
        const value = configLevel[key];
        if (typeof value === 'object') setUniqueEndpoints(value);
        if (typeof value !== 'string') continue;
        if (!isEndpoint(key)) continue;
        if (/[ ]/.test(value)) continue;
        if (endpoints.includes(value)) continue;
        endpoints.push(value.replace(/https?:\/\//, ''));
    }
}

function isEndpoint(key) {
    const lower = key.toLowerCase();
    return lower.includes('host') || lower.includes('endpoint');
}

const isLinux = process.platform === 'linux';
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isArm64 = process.arch === 'arm64';
let project_name;
let project_branch;
let project_version = 'unknown project version';
let releaseTestsVersion;

let envSpecific;
let envLevel;

let currentParallel = 0;
let cypressConfig = {};
let done = {};
let endpoints = [];
let lastInterimReportDate = new Date();
let maxParallel;
let parallelQueue = {};
let pending = {};
let processed = [];
let runAgain = {};
let runConfig;
let running = {};
let reportsRunFolder = '';
let serialQueue = {};
let specs = [];
let specsRoot;
let unreachableEndpoints = [];

checkDependencies();
loadRunConfig();
setMaxParallel();
setReleaseTestsVersion();
setProjectVariables();
determineAndSetEnvironmentVars();
reportsRunFolder = `test-reports-run/${envSpecific}`;
fs.emptyDirSync(reportsRunFolder);
setSpecsRoot();
outputStartupInfo();
getSpecsRecursive(specsRoot);
generateCypressConfig();
checkEndpointsReachable();
logSpecsToRun();
startSpecs();

// ToDo:
// - [ ] is there a possibility the first parallel test will finish before we queue the next one?
// - [ ] make it very clear if the precondition failed, people should not assume there was only 1 failed test
// - [x] make it clear which tests are running, and which are queued
// - [x] output a mochawesome report when a spec ends if it is at least 5 seconds since the last one
