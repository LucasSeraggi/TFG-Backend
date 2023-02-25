const config = require('./db.config')
const pgConn = {};

module.exports = {
  
  async dbConn () {
    pgConn = await config.dbConnect()
      .then((data) => {
        console.log('Connection Successful')
      })
      .catch((error) => {
        console.log('Connection Failure')
      })
  }
}
