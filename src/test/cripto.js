import bcrypt from 'bcrypt';

const saltRounds = 10;
const hash = await bcrypt.hash("123456789", saltRounds);
console.log(hash)