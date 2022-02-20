import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('new blog form', () => {
  const addBlog = jest.fn()
  const newBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'author',
    url: 'example.com'
  }

  let component, form, title, author, url
  beforeEach(() => {
    component = render(<BlogForm addBlog={addBlog}/>)
    form = component.container.querySelector('form')
    title = component.container.querySelector('#title')
    author = component.container.querySelector('#author')
    url = component.container.querySelector('#url')
  })

  test('calls event handler with correct details', () => {
    fireEvent.change(title, {
      target: { value: `${newBlog.title}` }
    })
    fireEvent.change(author, {
      target: { value: `${newBlog.author}` }
    })
    fireEvent.change(url, {
      target: { value: `${newBlog.url}` }
    })
    fireEvent.submit(form)
    expect(addBlog.mock.calls.length).toEqual(1)
    expect(addBlog.mock.calls[0][0]).toEqual(newBlog)
  })
})