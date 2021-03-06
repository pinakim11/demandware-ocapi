var config = require('../../config');
var dwocapi = require('../../dwocapi');
var catalog = {
		/**
		 * Get Product by Id
		 * @param req
		 * @param res
		 * @param next
		 */
		getProductById : function(req,res,next){
			var url = '/products/'+req.params.id+'/variations';
			var url1 = '/products/'+req.params.id;
			var url2 = '/products/'+req.params.id+'/images';
			options = {
					expand : 'availability,prices'
			};
			dwocapi.get(url,{},function(err,data){
				if(!err && data){
					res.product = data;
					dwocapi.get(url1,options,function(err,data1){
						if(!err && data1){
							console.log(data1)
							res.product.price = data1.price;
							res.product.inventory = data1.inventory;
							dwocapi.get(url2,{},function(err,data2){
								if(!err && data2){
									res.product.image_groups = data2.image_groups;
									next();
								}else{
									res.products = null;
									next();
								}
								
							});
						}else{
							res.products = null;
							next();
		 				}
						
		 			});
				}else{
					res.products = null;
					next();
 				}
				
 			});
		},
		/**
		 * @param product_img
		 * @param products
		 * @returns {___anonymous205_206}
		 */
		mapProduct : function(product_img,products){
			var productsmap = {};
			//Map products
			for(var k in products.hits){
					productsmap[products.hits[k].product_id] = products.hits[k];
			}
			//Map Images
			for(var k in product_img.hits){
			item = product_img.hits[k].product_id;
				if(typeof(productsmap[item])!=='undefined'){
					productsmap[item].image = product_img.hits[k].image;
				}
			}
			
			return productsmap;
		},
		/**
		 * Get Product by category
		 * @param req
		 * @param res
		 * @param next
		 */
		getProducts : function(req,res,next){
			var url = '/product_search/images';
			var url2 = '/product_search/prices';
			options = {
					refine_1:'cgid='+req.params.catalog
			};
			dwocapi.get(url2,options,function(err,data1){
				if(!err && data1){
					res.products = data1;
					dwocapi.get(url,options,function(err,data2){
						if(!err && data2){
							res.products = catalog.mapProduct(data2,res.products);
							next();
						}else{
							res.products = null;
							next();
						}
						
					});
				}else{
					res.products = null;
					next();
 				}
				
 			});
		},
		/**
		 * Get Categories
		 * @param req
		 * @param res
		 * @param next
		 */
		getCategories : function(req,res,next){
			var url = '/categories/root';
			options = {
					levels:1	
			};
			dwocapi.get(url,options,function(err,data){
 				if(!err && data){
					res.cats = data;
		 		}else{
					res.cats = null;
		 		}
		 		next();
		 	});
		},
 		/**
 		 * Render HOME
 		 * @param req
 		 * @param res
 		 */
 		render : function(req,res){
			res.render('home', { categories: res.cats.categories });
		},
		/**
		 * Render PLP
		 * @param req
		 * @param res
		 */
		renderPLP : function(req,res){
			res.render('products', {categories: res.cats.categories,products: res.products});
 		},
 		/**
 		 * render PDP page
 		 * @param req
 		 * @param res
 		 */
		renderPDP : function(req,res){
			//console.log(res.product);
			res.render('product_detail', {categories: res.cats.categories,product: res.product});
 		}
};
module.exports = catalog;