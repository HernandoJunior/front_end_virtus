module.exports = {
  apps: [{
    name: "virtuswebcrm",
    script: "serve",
    env: {
      PM2_SERVE_PATH: './dist',
      PM2_SERVE_PORT: process.env.PORT || 8080,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_HOMEPAGE: '/index.html',
      VITE_API_URL: process.env.VITE_API_URL || 'https://my-spring-api.azurewebsites.net'
    }
  }]
};
