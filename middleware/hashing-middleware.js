const bcrypt = require('bcrypt');
const saltRounds = 10;

function hashPassword(req, res, next) {
    const { password } = req.body;

    // hashing the password
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // replace the password in the request body with the hashed password
    req.body.password = hashedPassword;

    next();
}

module.exports = {
    hashPassword
};
