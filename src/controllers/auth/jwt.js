const jwt = require('jsonwebtoken')

function create_token(name){
    const SECRET_TOKEN = process.env.TOKEN_PASSWORD;
    const token = jwt.sign({name}, SECRET_TOKEN, {expiresIn: '1000s'})

    return token
}

async function validate_token(req) {
    const token = req.cookies.token; // usar cookie, no header

    if (!token) {
        return null;
    }
    return new Promise((resolve) => {
        jwt.verify(token, process.env.TOKEN_PASSWORD, (err, user) => {
            if (err) {
                return resolve(null);
            }

            req.token = user;
            resolve(user);
        });
    });
}



module.exports = {
    create_token,
    validate_token
}