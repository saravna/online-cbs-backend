module.exports = {
  apps : [{
    name: 'BACKEND',
    script: 'npm start',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : '3.18.62.48',
      ref  : 'origin/master',
      repo : 'https://github.com/saravna/online-cbs-backend.git',
      path : '/var/www/backend',
      'post-deploy' : `sudo npm install 
                        && fuser -k 4000/tcp
                        && npx sequelize-cli db:migrate --env production 
                        && npm start
                        && pm2 reload ecosystem.config.js --env production`
    }
  }
};
