// generate-config.js
const fs = require('fs');

const config = `
window.ENV = {
  VITE_API_URL: '${process.env.VITE_API_URL || 'https://my-spring-api.azurewebsites.net'}'
};
`;
fs.writeFileSync('./dist/config.js', config);
console.log('✅ config.js gerado com sucesso!');