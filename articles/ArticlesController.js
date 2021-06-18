const express = require("express");
const router = express.Router();

router.get("/articles",function(req,res){

    res.send("teste");

});

router.get("/admin/articles/new",function(req,res){

    res.send("teste");

});


module.exports = router;