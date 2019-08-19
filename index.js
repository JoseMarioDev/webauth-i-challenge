const server = require('./server.js');
const chalk = require('chalk');

const port = process.env.PORT || 4000;

server.listen(port, () =>
  console.log(chalk.blue.bold(`\n** Running on port ${port} **\n`)),
);
