import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env.production.local'
})

const targetPath = './src/environments/environment.prod.ts';

const environmentFileContent = `
  export const environment = {
    production: true,
    apiUrl: '${process.env['API_URL']}',
    appVersion: '${process.env['APP_VERSION']}',
  };
`;

fs.writeFileSync(targetPath, environmentFileContent);
console.log('✅ Environment.prod.ts gerado com sucesso!');
