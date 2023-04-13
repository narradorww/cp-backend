import bcrypt from 'bcrypt';

const plainPassword = '123456';
const hashedPassword = bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(10));

console.log('Plain password:', plainPassword);
console.log('Hashed password:', hashedPassword);

const result = bcrypt.compareSync(plainPassword, hashedPassword);
console.log('Password comparison result:', result);
