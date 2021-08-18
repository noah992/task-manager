var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var env = require('../environment/environment.json');
var auth = require('../middleware/auth');
var bcrypt = require('bcrypt');

var mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/Angular", { useNewUrlParser: true, useUnifiedTopology: true, })
mongoose.connection.on( 'connected', function(){
  console.log('users connected.');
});

var Schema = mongoose.Schema
var Users = new Schema({
  id:Number,
  username:String,
  password:String,
  email:String,
  fname:String,
  lname:String,
  plan:String,
}, {collection:'users'})

var usersModel = mongoose.model('users', Users);

async function getUsers() {
  let users;
  await usersModel.find({}, function(e, d) {
    if (e) { console.log(e) }
    users = d
  })
  return users
}

async function getUserInfo(req, res) {
  const user = await usersModel.findOne({_id:req._id})
  if (!user) res.status(400).send('Token is invalid')

  const send = {
    id:user.id,
    username:user.username,
    password:user.password,
    email:user.email,
    plan:user.plan,
    fname:user.fname,
    lname:user.lname
  }
  return send
}

async function updateUser(id, update) {
  usersModel.findOneAndUpdate({id:id}, update, {new:true, upsert:true}, function(e,d) {
    if (e) { console.log(e) }
  })
}

async function configureProfile(_id, update) {
  usersModel.findOneAndUpdate({_id:_id}, update, {new:true, upsert:true}, function(e,d) {
    if (e) { console.log(e) }
  })
}

async function addUser(userInfo) {
  return new Promise((res,rej) => {
    const newUser = new usersModel(userInfo)
    newUser.save(function(e, d) {
      if (e) { console.log(e) }
    })
    setTimeout(()=> {
      res(true)
    }, 1000)
  })
}

async function deleteUser(id) {
  await usersModel.deleteOne({id:id}, function(e, d) {
    if (e) { console.log(e) }
  })
}

// updateUser()

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const users = await getUsers()
  const aaa = {
    admin:'helloworld',
    whale:'mammal',
    frog:'amphobian',
    lizard:'reptile',
  }
  // await users.forEach(item => {
    // let np
    // bcrypt.hash(item.password, 10, function(e, d) {
    //   console.log(d)
    //   console.log
    //   np = d
    //   updateUser(item._id, {password:np})
    //   bcrypt.compare(item.password, d, function(e, d) {
    //     console.log(d)
    //   })
    // })
    // const np = aaa[item.username]
    // updateUser(item._id, {password:np})
  // })

  res.send(users)
});

router.delete('/', auth, async function(req, res, next) {
  await deleteUser(req.body.id)
  const users = await getUsers()
  res.send(users)
})

router.post('/signup', async function(req, res, next) {
  const hash = await new Promise((resolve, reject) => {
    bcrypt.hash(req.body.password, 10, function(e, d) {
      resolve(d)
    })
  })
  const newUser = {
    username:req.body.username,
    password: hash,
    email:req.body.username + '@taskmanager.com',
    plan:'free',
    fname:'yuri',
    lname:req.body.username.username,
  }
  await addUser(newUser).then(async data => {
    const users = await getUsers()
    console.log(111,users)

    res.send(users)
  })
})

router.get('/:username', auth, async function(req, res, next) {
  // const user = await usersModel.findOne({_id:req._id})
  // if (!user) res.status(400).send('Token is invalid')

  // const send = {
  //   id:user.id,
  //   username:user.username,
  //   password:user.password,
  //   email:user.email,
  //   plan:user.plan,
  //   fname:user.fname,
  //   lname:user.lname
  // }
  const userInfo = await getUserInfo(req, res)
  res.send(userInfo)
})

router.post('/login', async function(req, res, next) {

  let user = await usersModel.findOne({username:req.body.username})
  if (!user) res.status(400).send('The user does not exist')

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) res.status(400).send('Username or password is wrong')

  const token = jwt.sign({_id:user._id}, env.jwtPrivateKey)
  const userInfo = {
    username:user.username,
    bearerToken:token,
    password:user.password,
    email:user.email,
    plan:user.plan,
    fname:user.fname,
    lname:user.lname
  }
  res.send(userInfo)
});

router.get('/edit/:plan', auth, async function(req, res, next) {
  const update = {
    plan:req.params.plan,
  }
  await configureProfile(req._id, update)
  const userInfo = await getUserInfo(req, res)
  res.send(userInfo)
})

router.post('/edit', async function(req, res, next) {
  const update = {
    username:req.body.username,
    email:req.body.email,
  }
  await updateUser(req.body.id, update)
  const users = await getUsers()
  res.send(users)
})

module.exports = router;
