"use strict";
var util = require('util');
var config = require('../config');
var dwocapi = require('../dwocapi');
var catalog = require('./catalog/catalog');
var checkout = require('./checkout/checkout');

module.exports = function(app){
	app.get('/', catalog.getCategories, catalog.render);
	app.get('/cat/:catalog',catalog.getCategories, catalog.getProducts, catalog.renderPLP);
	app.get('/cat/product/:id',catalog.getCategories, catalog.getProductById, catalog.renderPDP);
	
	//Checkout Process
	app.get('/cart',catalog.getCategories,checkout.showCart,checkout.renderCART);
	app.post('/addToCart',catalog.getCategories,checkout.addToCart,checkout.renderCART);	
};
