const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database.js");
const categoriesController = require("./categories/CategoriesController.js");
const articlesController = require("./articles/articlesController.js");
const usersController = require("./user/UsersController.js");

const Article = require("./articles/Article.js") ;
const Category = require("./categories/Category.js");
const User = require("./user/User.js");

// Configurando a View Engine
app.set('view engine', 'ejs');

// Session
app.use(session({
    secret: "qualquercoisa", cookie: {maxAge: 30000}
}));

// Static files
app.use(express.static('public'));

// Configurando o Body Parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Database connection
connection
    .authenticate()
    .then(()=>{
        console.log("Conexão feita com sucesso ao banco de dados!");
    }).catch((error)=> {
        console.log(error);
    })

// use categoriesController routes
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", function(req,res){

    //res.send("Bem vindo ao meu blog");
    Article.findAll({
        order: [
            ['id','DESC']
        ],
        limit: 4
    }).then( articles => {

        Category.findAll().then(categories => {
            res.render("index.ejs",{articles: articles,categories: categories });
        });

    });
    
});

app.get("/:slug", function(req,res){

    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {

        if( article != undefined){                    
            Category.findAll().then(categories => {
                res.render("article.ejs",{article: article,categories: categories });
            });
        }else {

            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
});


app.get("/category/:slug", function(req,res){
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if( category != undefined){

            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories })
            });
        }else {
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    })
});

app.listen(8080,function(req,res){
    console.log("O servidor está rodando na porta 8080");
});