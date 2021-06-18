const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database.js");
const categoriesController = require("./categories/CategoriesController.js");
const articlesController = require("./articles/articlesController.js");

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
    res.render("index.ejs");
});

app.listen(8080,function(req,res){
    console.log("O servidor está rodando");
});