const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database.js");
const categoriesController = require("./categories/CategoriesController.js");
const articlesController = require("./articles/articlesController.js");

const Article = require("./articles/Article.js") ;
const Category = require("./categories/Category.js");

// Configurando a View Engine
app.set('view engine', 'ejs');

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

app.get("/", function(req,res){

    //res.send("Bem vindo ao meu blog");
    Article.findAll().then( articles => {
        res.render("index.ejs",{articles: articles});
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
            
            res.render("article.ejs", {article: article});
        }else {

            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });
});

app.listen(8080,function(req,res){
    console.log("O servidor está rodando");
});