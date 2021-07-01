const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify"); 

router.get("/admin/categories/new",function(req,res){

    res.render("admin/categories/new.ejs");
});

router.post("/categories/save",function(req,res){

    var title = req.body.title;
    if( title != undefined ){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        })

    } else {
        res.redirect("/admin/categories/new");
    }

});


router.get("/admin/categories",function(req,res){

    Category.findAll().then(categories => {

        res.render("admin/categories/index.ejs", {categories: categories} )
    }); 
});

router.post("/categories/delete",function(req,res){
    var id = req.body.id;
    if (id != undefined ) {

        if( !isNaN(id) ){ // é um número?
        
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            });

        }else { // NÃO É UM NÚMERO  
            res.redirect("/admin/categories");
        }
    } else { // NULL
        res.redirect("/admin/categories");
    }
});


router.get("/admin/categories/edit/:id", function(req,res){

    var id = req.params.id;

    if( isNaN(id) ){
        res.redirect("/admin/categories");
    }

    Category.findByPk(id).then(category => {

        if(category != undefined ){

            res.render("admin/categories/edit.ejs", {category:category});
        } else {
            res.redirect("/admin/categories");
        }

    }).catch(erro => {
        res.redirect("/admin/categories");
    }); 
});


router.post("/categories/update", function(req,res){

    var id = req.body.id;
    var title = req.body.title;
    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/categories");
    });
});

module.exports = router;