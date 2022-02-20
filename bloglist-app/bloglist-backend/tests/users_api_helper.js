const initialUsers = [
  {
    'username': 'Username1',
    'name': 'Name1',
    'passwordHash': '$2b$10$yX/ppmSsTi6ImID/Csu0Q.TmN0lCX/zydVDbouIn3bUHqcoEGa7aW',
    'password': 'password1'
  },
  {
    'username': 'Username2',
    'name': 'Name2',
    'passwordHash': '$2b$10$qTe2glZPwzBt76azwd7MJO8wEhjyd5dvApI00abjPj9LgXz1b9ipm',
    'password': 'password1'
  }
]

const userToAdd = {
  'username': 'Username3',
  'name': 'Name3',
  'password': 'password3'
}

const shortUsername = {
  'username': 'U4',
  'name': 'Name4',
  'password': 'password4'
}

const shortPassword = {
  'username': 'Username5',
  'name': 'Name5',
  'password': 'p5'
}

module.exports = { initialUsers, userToAdd, shortUsername, shortPassword }