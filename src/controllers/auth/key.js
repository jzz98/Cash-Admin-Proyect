const bcrypt = require('bcrypt');

async function hashPasword(password){
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

async function verifyPassword(password, hashedPassword){
    const match = await bcrypt.compare(password, hashedPassword)
    return match;
}

module.exports = {hashPasword, verifyPassword}