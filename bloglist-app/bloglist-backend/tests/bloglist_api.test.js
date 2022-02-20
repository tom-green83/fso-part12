const { update } = require('lodash')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const usersHelper = require('./users_api_helper')

let authToken

beforeAll (async () => {
  // Initialise users 
  await User.deleteMany({})
  const userObjects = usersHelper.initialUsers.map(initialUser => new User(initialUser))
  const promiseArray = userObjects.map(userObject => userObject.save())
  await Promise.all(promiseArray)

  // Login as Username1 and get token
  const loginInformation = {
    username: usersHelper.initialUsers[0].username,
    password: usersHelper.initialUsers[0].password
  }  
  authToken = 'bearer ' + (await api.post('/api/login').send(loginInformation)).body.token
})

// Reset blogs
beforeEach (async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(initialBlog => new Blog(initialBlog))
  const promiseArray = blogObjects.map(blogObject => blogObject.save())
  await Promise.all(promiseArray)
})

describe('get request to /api/blogs', () => {
  test('returns blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })
})

test('every blog on database has an id', async () => {
  const blogs = (await api.get('/api/blogs')).body
  const promiseArray = blogs.map(blog => {
    expect(blog.id).toBeDefined()
  })
  await Promise.all(promiseArray)
})

describe('post request to /api/blogs', () => {      
  test('returns the blog posted', async () => {
    const blog = (await api.post('/api/blogs').send(helper.newBlog).set('Authorization', authToken)).body
    delete blog.id  // Remove id field which doesn't exist in post request
    expect(blog.title).toEqual(helper.newBlog.title)
  })

  test('increases blog count by 1', async () => {
    await api.post('/api/blogs').send(helper.newBlog).set('Authorization', authToken)
    const blogs = (await api.get('/api/blogs')).body
    expect(blogs).toHaveLength(helper.initialBlogs.length +1 )
  })
})

describe('post request with no likes information', () => {  
  test('defaults to 0 likes', async () => {
    const blog = (await api.post('/api/blogs').send(helper.blogWithNoLikesInfo).set('Authorization', authToken)).body
    expect(blog.likes).toEqual(0)
  })
})

describe('post request without title and url', () => {  
  test('is reponded with status code 400', async () => {
    const response = await api.post('/api/blogs').send(helper.blogWithoutTitleAndUrl).set('Authorization', authToken)
    expect(response.status).toEqual(400)
  })
})

describe('post request without token', () => {  
  test('is reponded with status code 401', async () => {
    const response = await api.post('/api/blogs').send(helper.newBlog)
    expect(response.status).toEqual(401)
  })
})

// describe('delete request', () => {  
//   test('results in removal of blog', async () => {
//     await api.delete(`/api/blogs/${helper.blogToDelete._id}`)
//     const blogs = (await api.get('/api/blogs')).body
//     expect(blogs).toHaveLength(helper.initialBlogs.length - 1)
//     const ids = blogs.map(blog => blog.id)  
//     expect(ids).not.toContain(helper.blogToDelete.id)
//   })
// })

// Test edited to add a blog before deleting it due to API change
describe('delete request', () => {  
  test('results in removal of blog', async () => {
    const blogToDelete = (await api.post('/api/blogs').send(helper.blogToDelete).set('Authorization', authToken)).body
    await api.delete(`/api/blogs/${blogToDelete._id}`).set('Authorization', authToken)
    const blogs = (await api.get('/api/blogs')).body
    expect(blogs).toHaveLength(helper.initialBlogs.length)
    const ids = blogs.map(blog => blog.id)  
    expect(ids).not.toContain(blogToDelete.id)
  })
})


describe('put request to double likes', () => {
  test('results in blog being updated', async () => {
    const blogtoUpdate = (await api.post('/api/blogs').send(helper.blogToUpdate).set('Authorization', authToken)).body
    blogtoUpdate.likes = 2 * blogtoUpdate.likes
    const updatedBlog = (await api.put(`/api/blogs/${helper.blogToUpdate._id}`).send(blogtoUpdate)).body
    expect(updatedBlog.likes).toEqual(2 * helper.blogToUpdate.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})