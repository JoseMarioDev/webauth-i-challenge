const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model');

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(regedUser => {
      res.status(201).json(regedUser);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username;
        req.session.loggedIn = true;
        res.status(200).json({ message: `welcome ${user.username}` });
      } else {
        res.status(401).json({ message: 'invalid creds' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(200).json({ message: 'he gone' });
  });
});

module.exports = router;
