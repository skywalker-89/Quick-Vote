require("dotenv").config();

module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: "5h", // Token expiration time
};
