const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET

function generateToken(user) {
    
    const {id, username, email} = user
    let access_token = jwt.sign({id, username, email}, process.env.SECRET)
    
    return access_token
}

function verifyToken(token) {
    return jwt.verify(token, process.env.SECRET)
}

module.exports = { generateToken, verifyToken }