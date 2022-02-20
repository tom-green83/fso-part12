const config = require('./utils/config')
const app = require('./app')
const http = require('http')

const server = http.createServer(app)

const PORT = config.PORT || 3003
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})