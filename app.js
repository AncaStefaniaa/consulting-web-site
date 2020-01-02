const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts');
mongoose.connect('mongodb://localhost/backend');
let db = mongoose.connection;


//check connection
db.once('open',function(){
    console.log('Connected to MongoDB');
})
//check for db errors
db.on('error',function(){
    console.log(err);
});
//init app
const app = express();
/*app.use(expressLayouts);
app.set('view engine','ejs');*/
//bring in models
let Article = require('./models/article');

//load view engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set public folder
app.use(express.static(path.join(__dirname,'public')));
//body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//get single argicle
app.get('/article/:id',function(req,res){
    Article.findById(req.params.id,function(err, article){
       res.render('article',{
          article:article
       });
    });
});



//home route
app.get('/', function(req,res){
   let articles = Article.find({},function(err, articles){
        if(err){
            console.log(err)
        }
        else{
        res.render('index',{
        title:'Add articles',
        articles: articles
    });
    }
    });
});

// add route
app.get('/articles/add', function(req,res){

        res.render('add_article',{
        title:'Add articles',
        
    });
    });
  
//add submit post
app.post('/articles/add',function(req,res){
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
           res.redirect('/'); 
        }
    });
});  
//load edit form

app.get('/article/edit/:id',function(req,res){
    Article.findById(req.params.id,function(err, article){
       res.render('edit_article',{
          title:'edit article',
          article:article
       });
    });
});

//edit submit
app.post('/articles/edit/:id',function(req,res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}
    Article.update(query, article, function(err){
        if(err){
            console.log(err);
            return;
        }
        else{
           res.redirect('/'); 
        }
    });
});  


//start server
app.listen(3000,function(){
    console.log('Server started on port 3000');
});

