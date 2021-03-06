var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var env = require('../environment/environment.json');
var auth = require('../middleware/auth');
var bcrypt = require('bcrypt');


// connect to mongodb
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
  isAdmin:Boolean,
  claim:{canAccessTask:Boolean}
}, {collection:'users'})

var usersModel = mongoose.model('users', Users);


// get all users
async function getUsers() {
  let users;
  await usersModel.find({}, function(e, d) {
    if (e) { console.log(e) }
    users = d
  })
  return users
}

// get one user information
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
    lname:user.lname,
    isAdmin:user.isAdmin,
    claim:user.claim
  }
  return send
}

// update user information
async function updateUser(_id, update) {
  usersModel.findOneAndUpdate({_id:_id}, update, {new:true, upsert:true}, function(e,d) {
    if (e) { console.log(e) }
  })
}

// update user information
async function configureProfile(_id, update) {
  usersModel.findOneAndUpdate({_id:_id}, update, {new:true, upsert:true}, function(e,d) {
    if (e) { console.log(e) }
  })
}

// save new user
function addUser(userInfo) {
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

// delete user
async function deleteUser(id,res) {
  await usersModel.deleteOne({_id:id}, function(e, d) {
    if (e) { 
      console.log(e)
      // res.status(400).send('This user is invalid')
    }
  })
}


/* GET users listing. */

// get default users
router.get('/', auth, async function(req, res, next) {
  const users = await getUsers()
  res.send(users)
});


// delete user
router.delete('/', auth, async function(req, res, next) {
  deleteUser(req.body.id, res).then(() => {
    const users = getUsers()
    return users
  }).then(data => {
    res.send(data)
  })
})


// add new user
router.post('/signup', async function(req, res, next) {

  getUsers().then(data => {
    data.forEach(item => {
      if (item.username == req.body.username) {
        res.status(400).send('This username is already used')
        throw new Error ('This username is already used')
      }
    })
  }).then(async data => {
    // if (req.body.password.length < 5) {
    //   res.status(400).send('Password must be over 4 characters')
    //   throw new Error ('Password must be over 4 characters')
    // } else if (req.body.username.length < 5) {
    //   res.status(400).send('Username must be over 4 characters')
    //   throw new Error ('Username must be over 4 characters')
    // }
    // hash password
    const hash = await new Promise((resolve, reject) => {
      bcrypt.hash(req.body.password, 10, function(e, d) {
        resolve(d)
      })
    })
    return hash
  }).then(data => {
    const newUser = {
      username:req.body.username,
      password: data,
      email:req.body.username + '@taskmanager.com',
      plan:'free',
      fname:'yuri',
      lname:req.body.username,
      isAdmin:false,
      claim:{canAccessTask:true},
    }
  
    addUser(newUser).then(data => {
      const users = getUsers()
      return users
    }).then(data => {
      res.send(data)
    }).catch(e => {
      console.log(e)
      res.send(400)
    })
  }).catch(e => {
    console.log(e)
    res.send(400)
  })
})


// get one user information
router.get('/:username', auth, async function(req, res, next) {
  const userInfo = await getUserInfo(req, res)
  res.send(userInfo)
})


// login authentication
router.post('/login', async function(req, res, next) {

  let user = await usersModel.findOne({username:req.body.username})
  if (!user) return res.status(400).send('This user does not exist')

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Username or password is wrong')

  const token = jwt.sign({_id:user._id, username: user.username, isAdmin:user.isAdmin, claim:user.claim, plan:user.plan }, env.jwtPrivateKey)
  // const userInfo = {
  //   username:user.username,
  //   bearerToken:token,
  //   email:user.email,
  //   plan:user.plan,
  //   fname:user.fname,
  //   lname:user.lname,
  //   isAdmin:user.isAdmin,
  //   claim:user.claim,
  // }
  res.send({bearerToken:token})
});


// edit user property
router.get('/edit/:plan', auth, async function(req, res, next) {
  const update = {
    plan:req.params.plan,
  }
  await configureProfile(req._id, update)
  const userInfo = await getUserInfo(req, res)
  console.log(333, userInfo)
  res.send(userInfo)
})


// edit user information
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
