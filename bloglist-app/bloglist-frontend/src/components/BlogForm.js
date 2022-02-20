import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    const newObject = {
      title: title,
      author: author,
      url: url
    }
    addBlog(newObject)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <>
      <h2>create new</h2>
      <form className='blogForm' onSubmit={handleSubmit}>
        <div>
        title:<input id='title' type='text' value={title} name='Title' onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>
        author:<input id='author' type='text' value={author} name='Author' onChange={({ target }) => setAuthor(target.value)}/>
        </div>
        <div>
        url:<input id='url' type='text' value={url} name='Url' onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button id='submitBlogButton' type='submit'>create</button>
      </form>
    </>
  )}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default BlogForm