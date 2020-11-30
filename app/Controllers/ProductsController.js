const express = require('express');
const Product = require('../Models/Product');
const Category = require('../Models/Categorie')

const formidable = require('formidable');

const multer  = require('multer');
const upload = multer({ dest: '../../storage/uploads/' });
//const fileUpload= require('../Middlewares/file-upload');

exports.index = function(req, res){
    Product.find({deleted_at: null}, function(err, response){
        res.render('products/products', { products: response });
    }).lean();
};

exports.create = function(req, res){
    Category.find({deleted_at: null}, function(err, response){
        res.render('products/create-product', { categories: response });
    }).lean();
};

exports.store = function(req, res){
    var productData = req.body;
    var resultExec = verifyData(productData);
    if(resultExec == true){
        var newProduct = new Product({
            name: productData.name,
            description: productData.description,
            categoryId: productData.categoryId,
            created_at: Date.now(),
            updated_at: null,
            deleted_at: null
        });
        newProduct.save(function(err, Product){
            if(err){
                res.send('Error, please try later');
            }else{
                res.redirect('/products');
            }
        });
    }else {
        Category.find({deleted_at: null}, function(err, response){
            res.render('products/create-product', { categories: response, result: resultExec });
        }).lean();
    }
};

exports.show = function(req, res){
    Product.findById(req.params.productId, function(err, responseP){
        if(responseP){
            Category.findById(responseP.categoryId, function(err,responseC){
                res.render('products/show-product', { product: responseP, category: responseC });
            }).lean();
        }else{
            res.redirect('/products');
        }
    }).lean();
};

exports.edit = function(req, res){
    Product.findById(req.params.productId, function(err, responseP){
        Category.find({deleted_at: null}, function(err,responseC){
            res.render('products/edit-product', { product: responseP, categories: responseC });
        }).lean();
    }).lean();
};
exports.update = function(req, res){
    var productData = req.body;
    var resultExec = verifyData(productData, req.params.productId);
    productData.updated_at = Date.now();
    if(resultExec == true){
        Product.findByIdAndUpdate(
            req.params.productId, 
            productData, 
            function(err, response){
                if(err){
                    res.send('Error, please try later');
                }else{
                    res.redirect('/products');
                }
            }
        );
    }else {
        Category.find({deleted_at: null}, function(err, response){
            res.render('products/edit-product', { categories: response, result: resultExec });
        }).lean();
    }
};

exports.destroy = function(req, res){
    Product.findByIdAndUpdate(
        req.params.productId, 
        {deleted_at: Date.now()}, 
        function(err, response){
            if(err){
                res.send('Error, please try later');
            }else{
                res.redirect('/products');
            }
        });
    /*Product.findByIdAndRemove(req.params.productId,function(err, response){
        if(err){
            res.send('Error, please try later');
        }else{
            res.redirect('/products');
        }
    });*/
};

function verifyData(productData){
    if(productData.name.length <5){
        return {
            data: productData,
            message: "Sorry, something wrong!",
            error: "error",
            name_error: "error"
        };
    }else if(productData.description.length < 10) {
        return {
            data: productData,
            message: "Sorry, something wrong!",
            error: "error",
            desc_error: "error"
        };
    }else if(productData.categoryId == "slct"){
        return {
            data: productData,
            message: "Sorry, select category or go to create one!",
            error: "error",
            cat_error: "error"
        };
    }else{
        return true;
    }
}

function verifyData(productData, productId){
    if(productData.name.length <5){
        return {
            data: productData,
            productId: productId,
            message: "Sorry, something wrong!",
            error: "error",
            name_error: "error"
        };
    }else if(productData.description.length < 10) {
        return {
            data: productData,
            productId: productId,
            message: "Sorry, something wrong!",
            error: "error",
            desc_error: "error"
        };
    }else if(productData.categoryId == "slct"){
        return {
            data: productData,
            productId: productId,
            message: "Sorry, select category or go to create one!",
            error: "error",
            cat_error: "error"
        };
    }else{
        return true;
    }
}
function verifyFile(image){

}
