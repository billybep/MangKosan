const userRouter = require("express").Router();
const UserController = require('../controllers/userController')


userRouter.post('/register', UserController.registerUser)
userRouter.post('/login', UserController.loginUser)

module.exports = userRouter;