const path = require('path');
const exec = require('child_process').exec;
module.exports = (shipit) => {
  require('shipit-deploy')(shipit);
  require('shipit-shared')(shipit);
  require('shipit-pm2')(shipit);
  require('shipit-npm')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/tmp/dagcoin-explorer',
      deployTo: '/home/ignite/dagcoin-explorer',
      repositoryUrl: 'git@github.com:dagcoin/dagcoin-explorer.git',
      ignores: ['.git', 'node_modules'],
      branch: 'shipit',
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
      branch: 'shipit',
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
    if (!process.env.NODE_ENV === 'testnet') {
      return;
    }
    return exec('sh testnetify.sh', (error, stdout, stderr) => {
      console.log(`${stdout}`);
      console.log(`${stderr}`);
      if (error !== null) {
        console.log(`exec error: ${error}`);
        process.exit(1);
      }
    });
  })
};
