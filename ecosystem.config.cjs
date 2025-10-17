module.exports = {
  apps: [{
    name: 'virtuswebcrm',
    script: 'serve',   
    args: '-s .',     
    env: {
      NODE_ENV: 'production'
    }
  }]
};
