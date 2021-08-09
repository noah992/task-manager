var express = require('express');
var router = express.Router();
var data = require('./taskDatabase');
const SECRET_KEY = 'angularfinalevaluation';
const jwt = require('jsonwebtoken');

var taskId = data.taskId
var task = data.task.map(item => {
    return { ...item, date: getTime() }
})

/* GET home page. */
router.get('/', function(req, res, next) {
    const id = findId(req)
    const userTask = task.filter(item => +item.userId == +id)
    res.send(userTask);
});

router.post('/', function(req, res, next) {
    const id = findId(req)
    const newTask = { userId: id, id: taskId++, title: req.body.title, completed: false, date: getTime() }
    task = [newTask, ...task]
    const userTask = task.filter(item => +item.userId == +id)
    updateDatabase()
    res.send(userTask)
})

router.delete('/', function(req, res, next) {
    task = task.filter(item => item.id !== req.body.id)
    const id = findId(req)
    const userTask = task.filter(item => +item.userId == +id)
    updateDatabase()
    res.send(userTask)
})

router.post('/completed', function(req, res, next) {
    task = task.map(item => {
        if (item.id == req.body.id) {
            return { ...item , completed: true, date: getTime() }
        } else {
            return item
        }
    })
    const id = findId(req)
    const userTask = task.filter(item => item.userId == id)
    updateDatabase()
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

function getUser() {
    const user = require('./userDatabase')
    return user.tokenizedUsers
}

function updateDatabase() {
    data.task = task
    data.taskId = taskId
}

function getTime() {
    const date = new Date()
    return date.getHours()+':'+date.getMinutes()+'?'+date.getDate()+'/'+date.getMonth()
}

module.exports = router;
