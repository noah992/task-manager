var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var data = require('./userDatabase');
var tempUser = data.tempUser;
var userId = data.userId;
var tokenizedUsers = data.tokenizedUsers;

const SECRET_KEY = 'angularfinalevaluation';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(tempUser)
});

router.get('/:username', function(req, res, next) {
  res.send(tempUser.find(item => item.username == req.params.username))
})

router.get('/login', function(req, res, next) {
  res.send(200)
});

router.post('/login', function(req, res, next) {
  const [usernameReq, passwordReq] = req.headers.authorization.split(' ')[1].split(':')
  const token = jwt.sign({ username: usernameReq, password: passwordReq}, SECRET_KEY)
  for (let item of tokenizedUsers) {
    const {username, password} = jwt.verify(item.token, SECRET_KEY)
    if (username == usernameReq && password == passwordReq) {
      return res.send({ validity: true, token: token, id:item.id, plan: tempUser.find(i => i.id == item.id).plan })
    } 
  }
  res.send({ validity: false, token: null})
})

router.post('/signup', function(req, res, next) {
  const [usernameReq, passwordReq] = req.headers.authorization.split(' ')[1].split(':')
  const userInfo = {
    id: userId,
    username: usernameReq,
    password: passwordReq,
    email: usernameReq + '@taskmanager.com',
    fname: 'yuri',
    lname: usernameReq,
  }
  tempUser.push(userInfo)
  const token = jwt.sign({ username: usernameReq, password: passwordReq}, SECRET_KEY)
  tokenizedUsers = [...tokenizedUsers, { id: userId++, token: token }]
  updateDatabase()
  res.send({ id: userId -1 })
})

router.post('/edit', function(req, res, next) {
  tempUser = tempUser.map(item => {
    if (+item.id == +req.body.id) {
      return { ...item, id: item.id, username: req.body.username, password: req.body.password, plan:req.body.plan }
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
  updateDatabase()
  res.send({ id: req.body.id})
})

router.post('/edit/:plan', function(req, res, next) {
  tempUser = tempUser.map(item => {
    if (+item.id == +req.body.id) {
      return { ...item,  plan:req.params.plan }
    } else {
      return item
    }
  })
  updateDatabase()
  console.log(tempUser)
  res.send({ id:req.body.id, plan: req.params.plan })
})

router.delete('', function(req, res, next) {
  tempUser = tempUser.filter(item => item.id !== req.body.id)
  tokenizedUsers = tokenizedUsers.filter(item => item.id !== req.body.id)
  updateDatabase()
  res.send({ id: req.body.id })
})


function updateDatabase() {
  data.tempUser = tempUser
  data.tokenizedUsers = tokenizedUsers
  data.userId = userId - 1
}

module.exports = router;