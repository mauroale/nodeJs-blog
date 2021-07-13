const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const { response } = require("express");

router.get("/admin/articles",function(req,res){
    Article.findAll({
        include: [{model: Category}]
    }).then( articles => {
        
        res.render("admin/articles/index.ejs", {articles:articles});
    });

});

router.get("/admin/articles/new",function(req,res){
    Category.findAll().then(categories => {

        res.render("admin/articles/new.ejs", {categories: categories});
    })
});

router.post("/articles/save", function(req,res){

    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles")
    })
});


router.post("/articles/delete",function(req,res){
    var id = req.body.id;
    if (id != undefined ) {

        if( !isNaN(id) ){ // é um número?
        
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });

        }else { // NÃO É UM NÚMERO  
            res.redirect("/admin/articles");
        }
    } else { // NULL
        res.redirect("/admin/articles");
    }
});


router.get("/admin/articles/edit/:id", function(req,res){

    var id = req.params.id;

    Article.findByPk(id).then(article => {

        if(article != undefined){

            Category.findAll().then(categories => {

                res.render("admin/articles/edit.ejs",{ article:article,categories: categories});
            });
            
        }else {
            res.redirect("/");
        }

    }).catch( err => {

        res.redirect("/");
    });

});


router.post("/articles/update", function(req,res){

        var id = req.body.id;
        var title = req.body.title;
        var body = req.body.body;
        var category = req.body.category;


        Article.update({
            title: title,
            body: body,
            categoryId: category,
            slug: slugify(title)
        }, {
            where: {
                id: id
            }
        }).then( () => {
            res.redirect("/admin/articles");
        } ).catch( err => {
            res.redirect("/");
        });
});


router.get("/articles/page/:num", function(req,res){
    
    var page = req.params.num;
    var offset =  0;
    
    if( isNaN(page) || page == 1) {
        offset = 0;        
    } else {
        offset =  (parseInt( page ) -1) * 4 ;
    }
    
    
    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ["id","DESC"]
        ]
    
    }).then( articles => {
        
        var next ;
        if ( offset + 4 >= articles.count ) {

            next = false;
            
        } else {
            
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        } ;
        
        Category.findAll().then(categories => {

            res.render("admin/articles/page.ejs", {result:result, categories: categories});
        });

        
    
    }).catch({

    });

});

module.exports = router;