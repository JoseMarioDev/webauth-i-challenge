const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);

const authRouter = require('./auth/auth-router.js');
const usersRouter = require('./users/users-router.js');
const knexConnection = require('./database/dbConfig.js');

const server = express();

const sessionOptions = {
  name: 'theGodfather',
  secret: process.env.COOKIE_SECRET || 'dont tell anyone',
  cookie: {
    secure: process.env.COOKIE_SECURE || false,
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  },
  resave: false,
  saveUnitialized: true,
  store: new knexSessionStore({
    knex: knexConnection,
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionOptions));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'running', session: req.session });
});

module.exports = server;
