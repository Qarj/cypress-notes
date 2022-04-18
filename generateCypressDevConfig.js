const fs = require('fs-extra');

const args = process.argv.slice(2);
const envSpecific = args.length > 0 ? args[0] : '';
const destFolder = args.length > 1 ? args[1] : '.';

const configPath = `${destFolder}/cypress-dev-generated.json`;
const configOriginal = fs.readFileSync('cypress/cypress-dev.json', { encoding: 'utf8' });
const regEx = /[$][{]bamboo_team_name}/g;
const configGenerated = configOriginal.replace(regEx, envSpecific);
fs.writeFileSync(configPath, configGenerated, { encoding: 'utf8' });
