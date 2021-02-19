const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category")

// View Engine
app.set('view engine', 'ejs');

// Static 
app.use(express.static('public'))

// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
connection
    .authenticate()
    .then(() => console.log("Conexao feita com sucesso!"))
    .catch((error) => console.log(error));

app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {
    Article.findAll({ order: [['id','DESC']], limit: 4}).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles, categories})
        })
    })
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article
        .findOne({ where: {slug}})
        .then(article => {
            if(article != undefined) {
                Category.findAll().then(categories => {
                    res.render("article", {article, categories})
                })
            } else {
                res.redirect("/");
            }
        })
        .catch(err => {
            res.redirect("/");
        });

});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({ where: {slug}, include: [{model: Article}]})
        .then(category => {
            if(category != undefined ) {
                Category.findAll()
                    .then(categories => {
                        res.render("index", {articles: category.articles, categories})
                    })
            } else {
                res.redirect("/");
            }
        })
        .catch(err => {
            res.redirect("/");
        })
});

app.listen(8080, () => console.log("O servidor esta rodando!"));