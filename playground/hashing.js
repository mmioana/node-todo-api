const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
})

bcrypt.compare(password, '$2a$10$4rJtejowoYQkByeca8RWIeKBEeItEkf2Y8to0EROjPbGA9Cif0zw6', (err, res) => {
    console.log(res);
});

// let data = {
//     id: 10
// };
//
// const token = jwt.sign(data, '123');
// console.log(token);
//
// let decoded = jwt.verify(token, '123');
// console.log(decoded);

// let message = 'I am user 234AB56.';
//
// let hash = SHA256(message).toString();
//
// console.log(`Message: ${message} was converted to ${hash}`);
//
// let data = {
//     id: 4
// }
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (token.hash === resultHash) {
//     console.log('Data wasn\'t manipulated');
// } else {
//     console.log('Data was manipulated');
// }