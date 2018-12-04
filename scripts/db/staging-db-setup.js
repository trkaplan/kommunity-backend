/* eslint-disable no-console */
const { exec } = require('child_process');

if (process.env.NODE_ENV === 'staging') {
  exec('NODE_ENV=staging npm run db-setup', (err, stdout) => {
    if (err) {
      throw err;
    } else {
      console.log(stdout);
    }
  });
} else {
  console.log(`NOT RUNNING Staging DB Setup. Env is -> ${process.env.NODE_ENV}`);
}

console.log(process.env)
