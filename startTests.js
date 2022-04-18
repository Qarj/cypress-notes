// Doing it this way to get the environment variable passed to the bash script
// Passing of the environment variable appears not to work when done directly from the npm script to the bash script on some envs (Mac, Windows, Linux)
const shell = require('shelljs');

const args = process.argv.slice(2);
const specRoot = args.length > 0 ? args[0] : '';

// specifying bash forces to run in current window on Windows
// specifying bash means we do not need Windows incompatible ./ prefex
shell.exec(`bash run_tests.sh ${specRoot}`);
