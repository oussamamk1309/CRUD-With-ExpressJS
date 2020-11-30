const { response } = require('express');
const express = require('express');
const Category = require('../Models/Categorie');
const Product = require('../Models/Product');


exports.index = function(req, res){
    Category.find({deleted_at: null}, function(err, response){
        res.render('categories/categories', { categories: response });
    }).lean();
};

exports.create = function(req, res){
    res.render('categories/create-category');
};

exports.store = function(req, res){
    var categoryData = req.body;
    var resultExec = verifyData(categoryData);
    if(resultExec == true){
        var newCategory = new Category({
            name: categoryData.name,
            description: categoryData.description,
            created_at: Date.now(),
            updated_at: null,
            deleted_at: null
        });
        newCategory.save(function(err, Category){
            if(err){
                res.send('Error, please try later');
            }else{
                res.redirect('/categories');
            }
        });
    }else {
        res.render('categories/create-category', resultExec);
    }
};

exports.show = function(req, res){
    Category.findById(req.params.categoryId, function(err,responseC){
        if(responseC){
            Product.find({ categoryId: responseC._id }, function(err, responseP){
                res.render('categories/show-category', { products: responseP, category: responseC });
            }).lean();
        }else{
            res.redirect('/categories');
        }
    }).lean();
    /*Category.findById(req.params.categoryId, function(err, response){
        res.render('categories/show-category', {category: response});
    }).lean();*/
};

exports.edit = function(req, res){
    Category.findById(req.params.categoryId, function(err, response){
        res.render('categories/edit-category', {category: response});
    }).lean();
};
exports.update = function(req, res){
    var categoryData = req.body;
    var resultExec = verifyData(categoryData, req.params.categoryId);
    categoryData.updated_at = Date.now();
    if(resultExec == true){
        Category.findByIdAndUpdate(
            req.params.categoryId, 
            categoryData, 
            function(err, response){
                if(err){
                    res.send('Error, please try later');
                }else{
                    res.redirect('/categories');
                }
            }
        );
    }else {
        res.render('categories/edit-category', resultExec);
    }
};

exports.destroy = function(req, res){
    Category.findByIdAndUpdate(
        req.params.categoryId, 
        {deleted_at: Date.now()}, 
        function(err, response){
            if(err){
                res.send('Error, please try later');
            }else{
                res.redirect('/categories');
            }
        });
    /*Category.findByIdAndRemove(req.params.categoryId,function(err, response){
        if(err){
            res.send('Error, please try later');
        }else{
            res.redirect('/categories');
        }
    });*/
};
function verifyData(categoryData){
    if(categoryData.name.length <5){
        return {
            data: categoryData,
            categoryId: categoryId,
            message: "Sorry, something wrong!",
            error: "error",
            name_error: "error"
        };
    }else if(categoryData.description.length < 10) {
        return {
            data: categoryData,
            categoryId: categoryId,
            message: "Sorry, something wrong!",
            error: "error",
            desc_error: "error"
        };
    }else {
        return true;
    }
}

function verifyData(categoryData, categoryId){
    if(categoryData.name.length <5){
        return {
            data: categoryData,
            categoryId: categoryId,
            message: "Sorry, something wrong!",
            error: "error",
            name_error: "error"
        };
    }else if(categoryData.description.length < 10) {
        return {
            data: categoryData,
            categoryId: categoryId,
            message: "Sorry, something wrong!",
            error: "error",
            desc_error: "error"
        };
    }else {
        return true;
    }
}
