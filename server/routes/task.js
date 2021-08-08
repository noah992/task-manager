var express = require('express');
var router = express.Router();
var data = require('./database');
var user = require('./userDatabase');
const SECRET_KEY = 'angularfinalevaluation';
const jwt = require('jsonwebtoken');

var taskId = data.taskId
var task = data.task
var users = user.tokenizedUsers

function getUser() {
    const user = require('./userDatabase')
    return user.tokenizedUsers
}

/* GET home page. */
router.get('/', function(req, res, next) {
    // const token = req.headers.authorization.split(' ')[1]
    // const {username, password} = jwt.verify(token, SECRET_KEY)
    // let id
    // users.forEach((item) => {
    //     const decode = jwt.verify(item.token, SECRET_KEY)
    //     const decodedUsername = decode.username
    //     const decodedPassword = decode.password
    //     if (decodedUsername == username, decodedPassword == password) {
    //         id = item.id
    //     }
    // })
    const id = findId(req)
    const userTask = task.filter(item => +item.userId == +id)
    res.send(userTask);
});

router.post('/', function(req, res, next) {
    // const token = req.headers.authorization.split(' ')[1]
    // const {username, password} = jwt.verify(token, SECRET_KEY)
    // let id
    // users.forEach((item) => {
    //     const decode = jwt.verify(item.token, SECRET_KEY)
    //     const decodedUsername = decode.username
    //     const decodedPassword = decode.password
    //     if (decodedUsername == username, decodedPassword == password) {
    //         id = item.id
    //     }
    // })
    const id = findId(req)
    const newTask = { userId: id, id: taskId++, title: req.body.title, completed: false}
    task = [newTask, ...task]
    data.task = task
    const userTask = task.filter(item => +item.userId == +id)
    res.send(userTask)
})

router.delete('/', function(req, res, next) {
    task = task.filter(item => item.id !== req.body.id)
    const id = findId(req)
    const userTask = task.filter(item => +item.userId == +id)
    res.send(userTask)
})

function findId(req) {
    const token = req.headers.authorization.split(' ')[1]
    const {username, password} = jwt.verify(token, SECRET_KEY)
    let id = null
    getUser().forEach((item) => {
        const decode = jwt.verify(item.token, SECRET_KEY)
        const decodedUsername = decode.username
        const decodedPassword = decode.password
        if (decodedUsername == username, decodedPassword == password) {
            id = item.id
        }
    })
    return id
}

module.exports = router;
