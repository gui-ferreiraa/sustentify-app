import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const targetPath = './src/environments/environment.prod.ts';
const environmentFileContent = `
  export const environment = {
    production: true,
    API_BASE_URL: '${process.env.NG_SUS_API_BASE_URL}',
    ASSISTANT_BASE_URL: '${process.env.NG_SUS_ASSISTANT_BASE_URL}',
    makeRequest: Boolean(${process.env.NG_SUS_MAKE_REQUEST}),
    appVersion: '${process.env.NG_SUS_APP_VERSION}',
  };
`;

fs.writeFileSync(targetPath, environmentFileContent);
console.info('✅ Environment.prod.ts generation with success!');
