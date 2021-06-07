const { User } = require('../models')
const { generateToken } = require('../helpers/jwt.js')
const { checkPassword } = require('../helpers/bcrypt.js')
class UserController {
  static async registerUser(req, res, next) {
    const { username, email, password, fullname, bankAccount } = req.body
    console.log(req.body)
    try {
      const user = await User.create({
        email,
        username,
        password,
        fullname,
        bankAccount
      })
      res.status(201).json({
        id: user.id,
        email: user.email,
        username: user.username,
        fullname: user.fullname,
        bankAccount: user.bankAccount
      })

    } catch (err) {
      next(err)
    }
  }

  static async loginUser(req, res, next) {
    const { email, password } = req.body
    try {
      const user = await User.findOne({
        where: {
          email
        }
      })

      if (!user) {
        throw { status: 401, message: "email or password incorrect" }
      } else {
        const isPasswords = checkPassword(password, user.password)
        let obj = {
          id: user.id,
          email: user.email
        }
        const access_token = generateToken(obj)
        res.status(200).json({ access_token })
      }

    } catch (err) {
      next(err)
    }

  }

}

module.exports = UserController