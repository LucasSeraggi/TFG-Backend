import db from '../../config/databaseConnection.config';

class ResetPassword {

  async insertTokenReset(resetToken: string, email: string, isSchool: boolean) {
    const values = [
      resetToken,
      email,
    ];

    const query = {
      text: `
            UPDATE ${isSchool ? 'schools' : 'users'} 
            SET reset_token = $1,
                reset_token_created_at = CURRENT_TIMESTAMP
            WHERE email = $2;
          `,
      values,
    };

    try {
      const response = await db.dbConn(query);
      return response.rowCount;
    }
    catch (err: any) {
      console.error(err);
      throw err.detail ? err.detail : err.toString().replaceAll('"', "'");
    }
  }

  async getInfoByToken(reqResetToken: string) {
    const values = [
      reqResetToken,
    ];

    const querySchool = {
      text: `SELECT * FROM schools s WHERE s.reset_token = $1`,
      values,
    }

    const queryUser = {
      text: `SELECT * FROM users u WHERE u.reset_token = $1`,
      values,
    }

    try {
      let response = await db.dbConn(querySchool);
      let isSchool = true;
      if (response.rowCount === 0) {
        response = await db.dbConn(queryUser);
        isSchool = false;
        if (response.rowCount === 0) {
          return null;
        }
      }
      response = {
        "email": response.rows[0].email,
        "resetTokenCreatedAt": response.rows[0].reset_token_created_at,
        "isSchool": isSchool,
      };
      return response;
    }
    catch (err: any) {
      console.error(err);
      throw err.detail ? err.detail : err.toString().replaceAll('"', "'");
    }
  }

  async changePassword(email: string, isSchool: boolean, newPasswordHash: string) {
    const values = [
      newPasswordHash,
      email,
    ];
    const query = {
      text: `
              UPDATE ${isSchool ? 'schools' : 'users'} 
              SET password = $1
              WHERE email = $2;
            `,
      values,
    };
    const response = await db.dbConn(query);
    return response.rowCount;
  }

  async isTokenExpired(resetTokenCreatedAt: Date, maxHours: number) {
    const timeBetween = new Date().getTime() - resetTokenCreatedAt.getTime();
    if ( timeBetween / 3600000 > maxHours) {
      return true;
    }
    return false;
  }

}

export = ResetPassword;