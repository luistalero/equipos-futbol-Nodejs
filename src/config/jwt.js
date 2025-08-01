require('dotenv').config(); 

const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1h' 
};

module.exports = jwtConfig;