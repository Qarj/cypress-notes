const fs = require('fs-extra');

const args = process.argv.slice(2);
const envSpecific = args.length > 0 ? args[0] : '';
const destFolder = args.length > 1 ? args[1] : '.';

const configPath = `${destFolder}/cypress-${envSpecific}-generated.config.js`;
const configOriginal = fs.readFileSync('cypress/cypress-dev.config.js', {
    encoding: 'utf8',
});
const regEx = /[$][{]bamboo_team_name}/g;
const configGenerated = configOriginal.replace(regEx, envSpecific);
fs.writeFileSync(configPath, configGenerated, { encoding: 'utf8' });
fs.writeFileSync('cypress-dev-generated.config.js', configGenerated, {
    encoding: 'utf8',
});
