const express = require("express");
const router = express.Router();
const User = require("./User");


router.get("/admin/users", function(req,res){

    res.send("Listagem de usuários");
});

router.get("/admin/users/create", function(req,res){

    //res.send("Criacao de usuários");
    res.render("admin/users/create.ejs");
});

router.post("/users/create", function(req,res){

    var email = req.body.email;
    var password = req.body.password;

    res.json({
        email,password
    });
});

module.exports = router;