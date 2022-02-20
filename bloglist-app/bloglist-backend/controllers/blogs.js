const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user

  const blog = new Blog(request.body)
  // Check for missing title and url
  if((typeof(blog.title) === 'undefined') && (typeof(blog.url) === 'undefined')) {
    response.status(400).end()
  }
  else {
    // Check for missing likes
    if (typeof(blog.likes) === 'undefined') {
      blog.likes = 0
    }

    // Add user id to blog before saving    
    blog.user = user._id    
    const savedBlog = await blog.save()

    // Update user to include new blog id
    user.blogs = user.blogs.concat(blog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  
  // Get information of blog being deleted
  const blog = await Blog.findById(request.params.id)
  if (blog === null) {
    response.status(404).json({error: 'blog not found'})
  }
  else if ( blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({error: 'unauthorised'})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  // Get information of blog being updated
  const blog = await Blog.findById(request.params.id)
  if (blog === null) {
    response.status(404).json({error: 'blog not found'})
  } else {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {new: true})
    response.json(updatedBlog)
  }
})

module.exports = blogsRouter