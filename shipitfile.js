const path = require('path');
module.exports = (shipit) => {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);
  require('shipit-pm2')(shipit);
  require('shipit-npm')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/dagcoin-explorer',
      deployTo: '/home/ignite/dagcoin-explorer',
      repositoryUrl: 'https://github.com/dagcoin/dagcoin-explorer.git',
      ignores: ['.git', 'node_modules'],
      branch: 'master',
      keepReleases: 3,
      deleteOnRollback: false,
      shallowClone: true,
      pm2: {
        json: '/home/ignite/dagcoin-explorer/current/pm2.json'
      },
      shared: {
        overwrite: true,
        dirs: [
          'log'
        ],
        files: [
          '.env'
        ]
      }
    },
    testnet: {
      branch: 'master',
      servers: [
        'ignite@dagcoin-testnet'
      ]
    }
  });

  shipit.task('pm2:save', () => {
    const target = path.join(shipit.config.deployTo, 'current');
    return shipit.remote(`cd ${target} && pm2 save`);
  });

  shipit.on('npm_installed', () => {
    const target = path.join(shipit.config.deployTo, 'current');
    if (!process.env.NODE_ENV === 'testnet') {
      return;
    }
    return shipit.remote(`cd ${target} && sh testnetify.sh`)
      .then(res => {
        console.log(res[0].stdout);
        console.log(res[0].stderr)
      });
  })
};
