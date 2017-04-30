'use strict';
const express = require('express');
const sendSMS = require('../send-sms').sendSMS;
const callResturant = require('../send-sms').callResturant;
const bodyParser = require('body-parser');
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
    dataGlobal.name = customerName;
    dataGlobal.phone_number = customerPhone;
    knex('order_quantity').orderBy('order_id', 'desc').limit(1)
    .then(function(result) {
      console.log('reuslt[0].order_id');
    };
      // console.log('rows[0]', rows[0])
    //   // console.log('rows[0].order_id', rows[0].order_id);
    //   // console.log('rows[0].order_id', typeof rows[0].order_id);
    //   let next_id;
    //   if (!(rows[0].order_id)) {
    //     next_id = 1;
    //   } else {
    //     next_id = (rows[0].order_id) + 1;
    //   }
    //   knex('clients').insert({
    //     name: customerName,
    //     phone_number: customerPhone,
    //     address: customerAddress
    //   }).asCallback((err, rows) => {
    //     if (err) {
    //       // knex.destroy();
    //       return console.error('error inserting client', err);
    //     }
    //     console.log('New client successfully added');
    //     // knex.destroy();
    //   });
    //   console.log('next_id', next_id);
    //   console.log('query succesful');
    //   dataGlobal.id.forEach((id_num) => {
    //     const qty = dataGlobal.quantity[id_num];
    //     knex('orders').insert({
    //       client_id: 1
    //     }).asCallback((err, rows) => {
    //       if (err) {
    //         knex.destroy();
    //         return console.error('error inserting orderid', err);
    //       }
    //       console.log('New orderid successfully added');
    //       knex.destroy();
    //     });
    //     knex('order_quantity').insert({
    //       dish_id: id_num,
    //       quantity: qty,
    //       order_id: next_id
    //     }).asCallback((err, rows) => {
    //       if (err) {
    //         knex.destroy();
    //         return console.error('error inserting', err);
    //       }
    //       console.log('New order successfully added');
    //       knex.destroy();
    //     });
    //   });
    //   knex.destroy();
    //   res.redirect('/');
    // });
  });
  // console.log('Complete Data:', dataGlobal);
  // console.log(customerName);
  // console.log(customerPhone);
  // for (let item in dataGlobal) {
  //   console.log('item: ', item);
  //   // knex.insert({quantity: item.quantity[item]: dataGlobal.id,}, {});
  // }
  // knex.destroy();
  // });
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
  router.post('/call', (req, res) => {
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
