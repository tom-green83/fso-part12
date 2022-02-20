Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3003/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedInBlogUser', JSON.stringify(body))
    cy.visit('http://localhost:3000')
  })
})

Cypress.Commands.add('addBlog', (blog) => {
  // const authorisation = {Authorisation :`Bearer ${JSON.parse(localStorage.getItem('loggedInBlogUser')).token}`}
  cy.request({
    url: 'http://localhost:3003/api/blogs',
    method: 'POST',
    body: blog,
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInBlogUser')).token}`
    }
  })

  // cy.request('POST', 'http://localhost:3003/api/blogs' , blog, authorisation)
  cy.visit('http://localhost:3000')
})

Cypress.Commands.add('logout', () => {
  window.localStorage.removeItem('loggedInBlogUser')
  cy.visit('http://localhost:3000')
})