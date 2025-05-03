import * as fs from 'fs';
import * as path from 'path';

const API_BASE_URL = process.env.API_BASE_URL;
const ASSISTANT_BASE_URL = process.env.ASSISTANT_BASE_URL;
const APP_VERSION = process.env.APP_VERSION;

if (!API_BASE_URL || !ASSISTANT_BASE_URL || !APP_VERSION) {
  console.error('❌ Environments undefineds!');
}

const targetPath = path.resolve(__dirname, './src/environments/environment.prod.ts');

const environmentFileContent = `
  export const environment = {
    production: true,
    API_BASE_URL: '${API_BASE_URL}',
    ASSISTANT_BASE_URL: '${ASSISTANT_BASE_URL}',
    appVersion: '${APP_VERSION}',
  };
`;

fs.writeFileSync(targetPath, environmentFileContent);
console.info('✅ Environment.prod.ts generation with success!');
