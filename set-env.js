const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'src', 'environments');
const filePath = path.join(dirPath, 'environment.ts');

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}


const envConfigFile = `export const environment = {
  production: ${process.env.PRODUCTION || 'false'},
  apiUrl: '${process.env.API_URL || 'http://localhost:8080/api'}',
  supabase: {
    url: '${process.env.SUPABASE_URL || ''}',
    anonKey: '${process.env.SUPABASE_KEY || ''}'
  }
};
`;

fs.writeFileSync(filePath, envConfigFile);
console.log(`✅ environment.ts gerado com sucesso em: ${filePath}`);