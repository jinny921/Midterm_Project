'use strict';

const express = require('express');
const sendSMS = require('../send-sms').sendSMS;
const callResturant = require('../send-sms').callResturant;
const bodyParser  = require('body-parser');
const router = express.Router();

module.exports = (knex) => {
// getting dishes data from database for home page (/ = /orders)
  router.get('/', (req, res) => {
    knex
      .select('*')
      .from('dishes')
      .then((dishes) => {
        res.json(dishes);
      });
  });

// update order list with selected dishes
  router.put('/', (req, res) => {
    knex
      .select('name', 'price')
      .from('dishes')
      .then((selected) => {
        res.json(selected);
      });
  });
// getting order data from database after clicking checkout
  router.post('/checkout', (req, res) => {
    // knex('order_quantity')
    // .insert($(/* shopping cart items dish_ids */))
    // knex.destroy();
  });

  router.post('/payment', (req, res) => {
    // knex
    //   .select('*');
  });

  router.post('/callcontent', (req, res) => {
// this object will be filled with database values;
    const orderData = {
      orderNumber: '12313',
      clientInfo: {
        name: 'Elvisss',
        phoneNumber: '7782324505',
        address: '128 W. Hastings Ave, Vancouver, BC',
      },
      dishes: ['Massaman Curry of Braised Beef', 2, 'Pad Thai', 2],
    };
    res.set('Content-Type', 'text/xml');
    res.render('order', orderData);
  });
  router.post('/call', (req, res)=> {
    callResturant();
    res.send('calling');
  });
  router.post('/customerupdate', (req, res) => {
    
    let clientMessage = `Thanks for your order 
    you order number is ${req.body.ordernumber}
    and will be ready in ${req.body.preptime} minutes`;
    // sendSMS(clientMessage);
    res.redirect('/resturant');
  });
  return router;
};
