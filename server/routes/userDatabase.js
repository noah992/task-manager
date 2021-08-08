const jwt = require('jsonwebtoken');
const SECRET_KEY = 'angularfinalevaluation';

var tempUser = [
    {id:1, username:'admin', password:'helloworld' },
    {id:2, username:'whale', password:'mammal' },
    {id:3, username:'frog', password:'amphobian' },
    {id:4, username:'lizard', password:'reptile' },
]
var userId = 5

var tokenizedUsers = tempUser.map(item => {
    const token = jwt.sign({ username: item.username, password: item.password }, SECRET_KEY)
    return { id:item.id, token: token}
})

module.exports.tempUser = tempUser;
module.exports.userId = userId;
module.exports.tokenizedUsers = tokenizedUsers;