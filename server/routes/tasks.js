var express = require('express');
var router = express.Router();
var env = require('../environment/environment.json');
var auth = require('../middleware/auth');


// set up mondodb
var mongoose = require('mongoose');
mongoose.connect(env.db, { useNewUrlParser: true })
mongoose.connection.on( 'connected', function(){
  console.log('tasks connected.');
});

var Schema = mongoose.Schema
var Tasks = new Schema({
    userId:Number,
    id:Number,
    title:String,
    completed:Boolean,
    createdDate:String,
    dueDate:String,
    description:String,
    location:String,
    ref:String,
}, {collection:'tasks'})

var tasksModel = mongoose.model('tasks', Tasks);

// new task id
let gTaskId


function init() {
    tasksModel.find({}, function(e,d) {
        gTaskId = d.length + 1
    })
}

// get all tasks
async function getTasks() {
    let tasks;
    await tasksModel.find({}, function(e, d) {
        if (e) { console.log(e) }
        tasks = d
    })
    return tasks
}


// update a task
function updateTask(taskId, update) {
    tasksModel.findOneAndUpdate({id:taskId}, update, {new:true, upsert:true}, function(e,d) {
        if (e) { console.log(e) }
    })
}

// create new task
async function addTask(userTask) {
    const newTask = new tasksModel(userTask)
    newTask.save(function(e, d) {
      if (e) { console.log(e) }
    })
}

// delete task
function deleteTask(taskId) {
    tasksModel.deleteOne({id:taskId}, function(e, d) {
      if (e) { console.log(e) }
    })
}

/* GET users listing. */
// get user tasks
router.get('/', auth, async function(req, res, next) {
    let tasks = await getTasks()
    tasks = tasks.filter(item => item.ref == req._id)
    res.send(tasks)
});

// create new task
router.post('/', auth, async function(req, res, next) {
    const newTask = {
        ref:req._id,
        id: gTaskId++,
        userId: req.body.id,
        title: req.body.title,
        createdDate: getTime(),
        completed:false
    }
    await addTask(newTask)
    res.send(newTask)
})

// delete a task
router.delete('/', auth, async function(req, res, next) {
    await deleteTask(req.body.id)
    let tasks = await getTasks()
    tasks = tasks.filter(item => item.ref == req._id)
    res.send(tasks)
})

// when task completed
router.post('/completed', auth, async function(req, res, next) {
    const taskId = req.body.id
    await updateTask(taskId, {completed:true})
    res.send({id:req.body.id})
})

// edit task details
router.post('/editTask', auth, async function(req, res, next) {
    const taskId = req.body.id
    await updateTask(taskId, req.body.content)
    res.send({id:req.body.id, ...req.body.content})
})

// time information for tasks
function getTime() {
    const date = new Date()
    return ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+' '+date.getMonth()+'/'+date.getDate()+"/"+date.getFullYear()
}

init()

module.exports = router;
