var express = require('express');
var router = express.Router();

var Category = require('../models/category');

router.get('/', function(req, res){
   
    Category.find(function(err,categories){
        if(err) return console.log(err);
        
        res.render('admin/categories',{
            categories: categories
        });
    });
});

router.get('/add-category', function(req, res){
    var title = "";
    

    res.render('admin/add_category', {
        title: title
        
    });
});
router.post('/add-category', function(req, res){
    
    req.checkBody('title', 'Title must have a value').notEmpty();

    var title = req.body.title;
    //console.log(title);
    
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    
    //console.log(content);
    

    var errors = req.validationErrors();
    console.log(errors);
    

    if(errors){
        //console.log(errors);
        
        res.render('admin/add_category', {
            errors: errors,
            title: title,
        });
    }else{
        Category.findOne({slug: slug},function(err, cat){

            if(cat){
                req.flash('danger', 'category title exit, choose another');
                res.render('admin/add_category', {
                    title: title

                });
            }else{
                var cat = new Category({
                    title: title,
                    slug: slug
                
                });
                cat.save(function(err){
                    if(err){
                        console.log(err);
                        
                    }
                    req.flash('success');
                    res.redirect('/admin/categories');
                });
            }
        });
        
    }
   
});


router.get('/edit-category/:id', function(req, res){
    
    Category.findById(req.params.id,function(err, category){
        //console.log(page);
        
        if(err){
            return console.log(err);
        }else if(!category){
            res.status('404').json({
                message: 'category not found'
            });
        }
        else{
            res.render('admin/edit_category', {
                title: category.title,
                id: category._id
            });
        }
            
         
        
    });

    
});
router.post('/edit-category/:id', function(req, res){
    
    req.checkBody('title', 'Title must have a value').notEmpty();

    var title = req.body.title;
    //console.log(title);
    
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var id = req.params.id;
    //console.log(content);
    

    var errors = req.validationErrors();
    
    

    if(errors){
        //console.log(errors);
        
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });
    }else{
        Category.findOne({slug: slug, _id:{'$ne': id}},function(err, category){

            if(category){
                req.flash('danger', 'category title exit, choose another');
                res.render('admin/edit_category', {
                    title: title,
                    id:id
                });
            }else{
                category.findById(id, function(err, category){

                    if(err) return console.log(err);
                    console.log(id);
                    
                    
                    category.title= title,
                    category.slug= slug
                   

                    category.save(function(err){
                        if(err){
                            console.log(err);
                            
                        }
                    req.flash('success');
                    res.redirect('/admin/categories');
                     });
                });
                
               
            }
        });
        
    }
   
});

module.exports = router;