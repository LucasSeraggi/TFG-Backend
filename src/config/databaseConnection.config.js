const config = require('./db.config')

config.database.connection.query('SELECT $1 AS value',)
  .then((data) => {
    console.log('DATA:', data.value)
  })
  .catch((error) => {
    console.log('ERROR:', error)
  })

