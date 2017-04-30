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
  const dataGlobal = {
    id: {},
    quantity: {},
  };
  router.post('/checkout', (req, res) => {
    const dataBody = req.body;
    const dishIDs = Object.keys(dataBody);
    const dishQuantities = {};
    dishIDs.forEach((dishID) => {
      dishQuantities[dishID] = Number(dataBody[dishID].quantity);
    });
    dataGlobal.id = dishIDs;
    dataGlobal.quantity = dishQuantities;
    // knex('order_quantity')
    // .insert($(/* shopping cart items dish_ids */))
    // knex.destroy();
  });

  router.post('/payment', (req, res) => {
    const dataBody = req.body;
    const customerName = dataBody.name;
    const customerPhone = dataBody.phone_number;
    const customerAddress = 'fake';
    let nextID;
    console.log('passed in order:', dataGlobal);  
    knex('clients').insert({ name: customerName, phone_number: customerPhone, address: customerAddress }).asCallback((err, rows) => {
      if (err) {
        knex.destroy();
        return console.error('error inserting client', err);
      }

      console.log('New client successfully added');
      knex('clients').orderBy('id', 'desc').limit(1).asCallback((err, rows) => {
        const clientID = rows[0].id;
        knex('orders').insert({client_id: clientID }).asCallback((err, rows) => {
          if (err) {
            knex.destroy();
            return console.error('error inserting order', err);
          }
          console.log('New order successfully added');
          knex('orders').orderBy('id', 'desc').limit(1).asCallback((err, rows) => {
            if (err) {
              knex.destroy();
              return console.error('error querying order id', err);
            }
            console.log(' orderID successfully grabbed');
            if (!(rows[0].id)) {
              nextID = 1;
            } else {
              nextID = (rows[0].id);

              dataGlobal.id.forEach((id_num) => {
                const qty = dataGlobal.quantity[id_num];
          

                knex('order_quantity').insert({ quantity: qty, dish_id: id_num, order_id: nextID }).asCallback((err, rows) => {
                  if (err) {
                    knex.destroy();
                    return console.error('error inserting into order_quantity table', err);
                  }
                  console.log('New order successfully added order quantity');
                });
              });
            }
          });
        });
      });
                  // knex.destroy();
    });
                  res.redirect('/');
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
      dishes: ['Massaman Curry of Braised Beef', 2, 'Pad Thai', 2]
    };
    res.set('Content-Type', 'text/xml');
    res.render('order', orderData);
  });
  router.post('/call', (req, res)=> {
    callResturant();
    res.send('calling');
  });

  router.post('/customerupdate', (req, res) => {
    const clientMessage = `Thanks for your order 
    you order number is ${req.body.ordernumber}
    and will be ready in ${req.body.preptime} minutes`;
    sendSMS(clientMessage);
    res.redirect('/resturant');
  });
  return router;
};
