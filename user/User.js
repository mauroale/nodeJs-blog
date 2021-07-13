const Sequelize = require("sequelize");
const connection = require("../database/database.js");

const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    password : {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// force syncro with the database
User.sync({ force:false });

module.exports = User;