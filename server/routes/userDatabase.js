const jwt = require('jsonwebtoken');
const SECRET_KEY = 'angularfinalevaluation';

var tempUser = [
    {id:1, username:'admin', password:'helloworld', email:'admin@taskmanager.com', fname:'juri', lname:'admin', plan:'free' },
    {id:2, username:'whale', password:'mammal', email:'whale@taskmanager.com', fname:'juri', lname:'whale', plan:'free' },
    {id:3, username:'frog', password:'amphobian', email:'amphobian@taskmanager.com', fname:'juri', lname:'frog', plan:'free' },
    {id:4, username:'lizard', password:'reptile', email:'reptile@taskmanager.com', fname:'juri', lname:'lizard', plan:'free' },
]
var userId = 5

var tokenizedUsers = tempUser.map(item => {
    const token = jwt.sign({ username: item.username, password: item.password }, SECRET_KEY)
    return { id:item.id, token: token}
})

module.exports.tempUser = tempUser;
module.exports.userId = userId;
module.exports.tokenizedUsers = tokenizedUsers;