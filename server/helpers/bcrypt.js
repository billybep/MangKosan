const bcrypt = require("bcrypt")
const saltRounds = 10

function hashPassword(user) {
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(user, salt)
    return hash
}

function checkPassword(password, hashedPasswords) {
    return bcrypt.compareSync(password, hashedPasswords)
}

module.exports = {hashPassword, checkPassword}