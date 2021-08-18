const jwt = require('jsonwebtoken');
const env = require('../environment/environment.json');

module.exports = function(req, res, next) {
    let token = req.header('authorization');
    if (!token) return res.status(401).send('Token needed');
    token = token.split(' ').length > 1 ? token.split(' ')[1] : null

    try {
        const decode = jwt.decode(token, env.jwtPrivateKey)
        req._id = decode._id
        next()
    } catch (e) {
        res.status(400).send('Invalid Token')
    }
}