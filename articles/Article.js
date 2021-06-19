const Sequelize = require("sequelize");
const connection = require("../database/database.js");
const Category = require("../categories/Category.js");

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug : {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    body : {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); // One Category has a lot of Articles 
Article.belongsTo(Category); // One Article belongs to a Category. 1 <-> 1

// force syncro with the database
//Article.sync({force:true});

module.exports = Article;