const { describe } = require('eslint/lib/rule-tester/rule-tester')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const { shortPassword } = require('./users_api_helper')
const { shortUsername } = require('./users_api_helper')
const helper = require('./users_api_helper')

beforeEach (async () => {
  await User.deleteMany({})
  const userObjects = helper.initialUsers.map(initialUser => new User(initialUser))
  const promiseArray = userObjects.map(userObject => userObject.save())
  await Promise.all(promiseArray)
})

describe ('get request to /api/users', () => {
  test('returns correct number of users', async () => {
    const returnedUsers = (await api.get('/api/users')).body
    expect(returnedUsers).toHaveLength(helper.initialUsers.length)
  })
})

describe('adding a user', () => {
  test('returns added user', async () => {
    const userToAdd = helper.userToAdd
    const savedUser = (await api.post('/api/users').send(userToAdd)).body
    expect(savedUser.username).toEqual(userToAdd.username)
    expect(savedUser.name).toEqual(userToAdd.name)
  })

  test('with a username shorter than 3 characters fails', async () => {
    const result = await api.post('/api/users').send(shortUsername)
    expect(result.status).toEqual(400)
    expect(result.body.error).toEqual('username must be at least 3 characters long')

  })

  test('with a password shorter than 3 characters fails', async () => {
    const result = await api.post('/api/users').send(shortPassword)
    expect(result.status).toEqual(400)
    expect(result.body.error).toEqual('password must be at least 3 characters long')
  })
})

afterAll(() => {
  mongoose.connection.close()
})