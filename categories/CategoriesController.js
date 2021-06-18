const express = require("express");
const router = express.Router();

router.get("/categories",function(req,res){

    res.send("teste");

});

router.get("/admin/categories/new",function(req,res){

    res.send("teste");

});


module.exports = router;