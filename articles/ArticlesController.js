const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

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



module.exports = router;