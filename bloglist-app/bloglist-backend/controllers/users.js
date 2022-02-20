const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

userRouter.post('/', async (request, response) => {  
  const body = request.body
  
  // Check for invalid username and password length
  if (body.username.length < 3) {
    response.status(400).json({error: 'username must be at least 3 characters long'})
  } else if (body.password.length < 3) {
    response.status(400).json({error: 'password must be at least 3 characters long'})

  } else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
  
    const newUser = new User ({
      username: body.username,
      name: body.name,
      passwordHash: passwordHash
    })
    const savedUser = await newUser.save()
    response.json(savedUser)
  }
})

module.exports = userRouter