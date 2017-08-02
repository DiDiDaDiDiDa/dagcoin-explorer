const path = require('path');

module.exports = (shipit) => {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);
  require('shipit-pm2')(shipit);
  require('shipit-npm')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/dagcoin-explorer-test',
      deployTo: '/home/ignite/dagcoin-explorer-test',
      repositoryUrl: 'git@github.com:dagcoin/dagcoin-explorer.git',
      ignores: ['.git', 'node_modules'],
      branch: 'shipit',
      keepReleases: 3,
      deleteOnRollback: false,
      shallowClone: true,
      pm2: {
        json: '/home/ignite/dagcoin-explorer-test/current/pm2.json'
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
    production: {
      branch: 'shipit',
      servers: [
        'ignite@194.204.60.69'
      ]
    }
  });

  shipit.task('pm2:save', () => {
    const target = path.join(shipit.config.deployTo, 'current');
    return shipit.remote(`cd ${target} && pm2 save`);
  });
};
