const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
    res.send("Listagem de usuários");
});

router.get("/admin/users/create", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/users/create",{categories});
    });
});

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    User.create({email, password: hash})
        .then(() => {
            res.redirect("/");
        })
        .catch(() => {
            res.redirect("/");
        });

})

module.exports = router;