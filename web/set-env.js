import * as fs from 'fs';

dotenv.config({
  path: '.env.production.local'
})

const targetPath = './src/environments/environment.prod.ts';

const environmentFileContent = `
  export const environment = {
    production: true,
    API_BASE_URL: '${process.env.API_BASE_URL}',
    ASSISTANT_BASE_URL: '${process.env.ASSISTANT_BASE_URL}',
    appVersion: '${process.env.APP_VERSION}',
  };
`;

fs.writeFileSync(targetPath, environmentFileContent);
console.info('✅ Environment.prod.ts generation with success!');
