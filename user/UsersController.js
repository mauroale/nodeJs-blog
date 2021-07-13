const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");


router.get("/admin/users", function(req,res){

    User.findAll().then(users => {

        res.render("admin/users/index.ejs", {users:users});
    });


});

router.get("/admin/users/create", function(req,res){

    //res.send("Criacao de usuários");
    res.render("admin/users/create.ejs");
});

router.post("/users/create", function(req,res){

    var email = req.body.email;
    var password = req.body.password;


    User.findOne({where: {email:email}}).then( user => {
        if( user == undefined ){

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password ,salt);
        
            User.create({
                email: email,
                password: hash    
            }).then( () => {
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/");
            });

        } else {
            res.redirect("/admin/users/create");
        }
    });


  

    /*
    res.json({
        email,password
    });
    */
});


router.get("/login", function(req,res){

    res.render("admin/users/login");
});

router.post("/authenticate", function(req,res){

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    }).then(
        user => {
            if(user != undefined){ // if there is a user with this email
                // validate password
                var correct = bcrypt.compareSync(password,user.password);

                if ( correct ) {
                    
                    req.session.user = {
                        id: user.id,
                        email: user.email
                    }

                    res.json(req.session.user);

                }else {
                    res.redirect("/login");
                }

            } else {
                res.redirect("/login");
            }
        }
    );

});

module.exports = router;