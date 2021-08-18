var express = require('express');
var router = express.Router();
var env = require('../environment/environment.json');
var auth = require('../middleware/auth');

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

// var Uusers = new Schema({
//   id:Number,
//   username:String,
//   password:String,
//   email:String,
//   fname:String,
//   lname:String,
//   plan:String,
// }, {collection:'users'})

// var usersModel = mongoose.model('uusers', Uusers);

// let tempUsers

// usersModel.find({}, function(er, doc) {
//     tempUsers = doc
//     let tempTasks
// tasksModel.find({}, function(e, d) {
//     tempTasks = d
//     tempUsers.forEach(tu => {
//         tempTasks.forEach(item => {
//             let newItem
//             if (tu.id == item.userId) {
//                 newItem = tu
//                 tasksModel.findOneAndUpdate({id:item.id}, {refId:tu._id}, {new:true, upsert:true}, function (e, d) {
//                     console.log(21, tu)
//                 })
//             }
//         })
//     })
// })
// })

// usersModel.find({}, function (e, d) {
//     tasksModel.find({}, function (ee, dd) {
//     for (let i = 0; i < 201; i++) {
//         const nnn = d.find(item => dd[i].userId == item.id)
//         // const nnn = d.find(item => item.id == i)
//         if (nnn) {
//             tasksModel.findOneAndUpdate({id:i}, {ref:nnn._id}, {new:true, upsert:true}, function (e, d) {
//                 // console.log(33, d)
//             })
//         }
//     }
//     })
// })

// function getTime() {
//     const date = new Date()
//     return date.getHours()+':'+date.getMinutes()+'?'+date.getDate()+'/'+date.getMonth()+"/"+date.getFullYear()
// }

// tasksModel.find({}, function(e,d) {
//     d.forEach(item => {
//         tasksModel.findOneAndUpdate({_id:item._id}, {createdDate:getTime()} , {new:true, upsert:true}, function(e,d) {
//             console.log(d)
//         })
//     })
// })

let gTaskId

function init() {
    tasksModel.find({}, function(e,d) {
        gTaskId = d.length + 1
    })
}


async function getTasks() {
    let tasks;
    await tasksModel.find({}, function(e, d) {
        if (e) { console.log(e) }
        tasks = d
    })
    return tasks
}

function updateTask(taskId, update) {
    console.log(taskId)
    tasksModel.findOneAndUpdate({id:taskId}, update, {new:true, upsert:true}, function(e,d) {
        if (e) { console.log(e) }
    })
}

async function addTask(userTask) {
    const newTask = new tasksModel(userTask)
    newTask.save(function(e, d) {
      if (e) { console.log(e) }
    })
}
  
function deleteTask(taskId) {
    tasksModel.deleteOne({id:taskId}, function(e, d) {
      if (e) { console.log(e) }
    })
}

/* GET users listing. */
router.get('/', auth, async function(req, res, next) {
    let tasks = await getTasks()
    tasks = tasks.filter(item => item.ref == req._id)
    res.send(tasks)
});

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

router.delete('/', auth, async function(req, res, next) {
    await deleteTask(req.body.id)
    let tasks = await getTasks()
    tasks = tasks.filter(item => item.ref == req._id)
    res.send(tasks)
})

router.post('/completed', auth, async function(req, res, next) {
    const taskId = req.body.id
    console.log(req.body)
    await updateTask(taskId, {completed:true})
    res.send({id:req.body.id})
})

router.post('/editTask', auth, async function(req, res, next) {
    const taskId = req.body.id
    await updateTask(taskId, req.body.content)
    res.send({id:req.body.id, ...req.body.content})
})

function getTime() {
    const date = new Date()
    return ('0'+date.getHours()).slice(-2)+':'+('0'+date.getMinutes()).slice(-2)+' '+date.getMonth()+'/'+date.getDate()+"/"+date.getFullYear()
}

init()

module.exports = router;
