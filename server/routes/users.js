var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var data = require('./userDatabase');
var tempUser = data.tempUser;
var userId = data.userId;
var tokenizedUsers = data.tokenizedUsers;

const SECRET_KEY = 'angularfinalevaluation';

// let tempUser = [
//   {id:1, username:'admin', password:'helloworld' },
//   {id:2, username:'whale', password:'mammal' },
//   {id:3, username:'frog', password:'amphobian' },
//   {id:4, username:'lizard', password:'reptile' },
// ]

// var userId = 5

// let tokenizedUsers = tempUser.map(item => {
//   const token = jwt.sign({ username: item.username, password: item.password }, SECRET_KEY)
//   return { id:item.id, token: token}
// })

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(tempUser)
});

router.get('/login', function(req, res, next) {
  res.send(202)
});

router.post('/login', function(req, res, next) {
  const [usernameReq, passwordReq] = req.headers.authorization.split(' ')[1].split(':')
  const token = jwt.sign({ username: usernameReq, password: passwordReq}, SECRET_KEY)
  for (let item of tokenizedUsers) {
    const {username, password} = jwt.verify(item.token, SECRET_KEY)
    if (username == usernameReq && password == passwordReq) {
      return res.send({ validity: true, token: token })
    } 
  }
  res.send({ validity: false, token: null})
})

router.post('/signup', function(req, res, next) {
  const [usernameReq, passwordReq] = req.headers.authorization.split(' ')[1].split(':')
  tempUser.push({ id: userId, username: usernameReq, password: passwordReq })
  const token = jwt.sign({ username: usernameReq, password: passwordReq}, SECRET_KEY)
  tokenizedUsers = [...tokenizedUsers, { id: userId++, token: token }]
  data.tempUser = tempUser
  data.tokenizedUsers = tokenizedUsers
  res.send({ id: userId -1 })
})

router.post('/edit', function(req, res, next) {
  tempUser = tempUser.map(item => {
    if (+item.id == +req.body.id) {
      return { id: item.id, username: req.body.username, password: req.body.password }
    } else {
      return item
    }
  })
  tokenizedUsers = tokenizedUsers.map(item => {
    if (item.id == req.body.id) {
      const token = jwt.sign({ username: req.body.username, password: req.body.password}, SECRET_KEY)
      return { id: item.id, token: token }
    } else {
      return item
    }
  })
  res.send({ id: req.body.id})
})

router.delete('', function(req, res, next) {
  tempUser = tempUser.filter(item => item.id !== req.body.id)
  tokenizedUsers = tokenizedUsers.filter(item => item.id !== req.body.id)
  res.send({ id: req.body.id })
})


function tokenize(char) {
  return jwt.sign(char, SECRET_KEY)
}

module.exports = router;