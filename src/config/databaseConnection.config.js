const config = require('./db.config')
let pgConn = {};

module.exports = {
  
  async dbConn (query) {

    pgConn = await config.dbConnect();
    return pgConn.query(query);

  }
}
