import { initial } from "lodash"

describe('Blog app', function() {
  const blogCreator = {
    username: 'blogcreator',
    name: 'Blog Creator',
    password: 'blogcreator'
  }

  const nonCreator = {
    username: 'noncreator',
    name: 'Non Creator',
    password: 'noncreator'
  }

  const blogToAdd = {
    title: 'Using Cypress to test blog app',
    author: 'author',
    url: 'example.com',
    likes: 1
  }

  const blogToLike = {
    title: 'Like this blog',
    author: 'author',
    url: 'example.com',
    likes: 10
  }

  const blog1Like = { title: '1', author: '1', url: '1', likes: 1 }
  const blog2Like = { title: '2', author: '2', url: '2', likes: 2 }
  const blog3Like = { title: '3', author: '3', url: '3', likes: 3 }


  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users/', blogCreator)
    cy.request('POST', 'http://localhost:3003/api/users/', nonCreator)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('login to application')
    cy.get('#username').parent().contains('username')
    cy.get('#password').parent().contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type(blogCreator.username)
      cy.get('#password').type(blogCreator.password)
      cy.get('#login-button').click()
      cy.contains(`${blogCreator.name} logged in`)
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type(blogCreator.username)
      cy.get('#login-button').click()
      cy.get('.error').contains('invalid credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: `${blogCreator.username}`, password: `${blogCreator.password}` })
    })

    it('A blog can be created', function() {
      cy.contains(`${blogCreator.name} logged in`)
      cy.contains('create new blog').click()
      cy.get('#title').type(blogToAdd.title)
      cy.get('#author').type(blogToAdd.author)
      cy.get('#url').type(blogToAdd.url)
      cy.get('#submitBlogButton').click()
      cy.get('.blog').contains(`${blogToAdd.title} ${blogToAdd.author}`)
    })

    it('A blog can be liked', function() {
      // Add blog to like
      cy.addBlog(blogToLike)

      // Like the blog
      cy.contains(`${blogToLike.title}`).get('button').contains('show').click()
      cy.get('.blog').contains(`${blogToLike.title}`).get('button').contains('like').click()
      cy.get('.blog').contains(`${blogToLike.title}`).contains(`likes ${blogToLike.likes + 1}`)
    })

    it('A blog can be deleted by its creator', function() {
      // Add blog to delete
      cy.addBlog(blogToAdd)

      // Delete the blog
      cy.get('.blog').contains(`${blogToAdd.title}`).get('.toggleDetailsButton').contains('show').click()
      cy.get('.blog').contains(`${blogToAdd.title}`).get('.removeButton').click()
      cy.get('.blog').contains((`${blogToAdd.title}`)).should('not.exist')
    })

    it('A blog can not  be deleted by a user who did not create it', function() {
      // Add blog to delete
      cy.addBlog(blogToAdd)

      // Logout as creator and login as another user
      cy.logout()
      cy.login({ username: `${nonCreator.username}`, password: `${nonCreator.password}` })

      // Try to find button to remove blog
      cy.get('.blog').contains(`${blogToAdd.title}`).get('.toggleDetailsButton').contains('show').click()
      cy.get('.blog').contains(`${blogToAdd.title}`).get('.removeButton').should('not.be.visible')
    })

    describe('When there are multiple blog posts', function() {
      beforeEach(function() {
        cy.addBlog(blog2Like)
        cy.addBlog(blog1Like)
        cy.addBlog(blog3Like)
      })

      it('Blogs are initally sorted by descending number of likes', function() {
        const initialLikes = [3, 2, 1]
        cy.get('.toggleDetailsButton').click({ multiple: true })
        cy.get('.blog').then((blogs) => {
          blogs.map((index, blog) => {
            cy.wrap(blog).contains(`likes ${initialLikes[index]}`)
          })
        })
      })

      it('Blogs are sorted by descending number of likes after liking', function() {
        cy.get('.toggleDetailsButton').click({ multiple: true })

        // Change 1->5, 2->6, 3->4 likes
        const finalLikes = [6, 5, 4]
        for (let i = 0; i <4; i++) {
          cy.get('.blog').contains(`${blog1Like.title} ${blog1Like.author}`).contains('like').click()
          cy.wait(200)
        }
        for (let i = 0; i <4; i++) {
          cy.get('.blog').contains(`${blog2Like.title} ${blog2Like.author}`).contains('like').click()
          cy.wait(200)
        }
        cy.get('.blog').contains(`${blog3Like.title} ${blog3Like.author}`).contains('like').click()

        // Check final likes
        cy.get('.blog').then((blogs) => {
          blogs.map((index, blog) => {
            cy.wrap(blog).contains(`likes ${finalLikes[index]}`)
          })
        })
      })
    })
  })
})
