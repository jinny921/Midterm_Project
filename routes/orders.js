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
    quantity: {}
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
  });

  router.post('/payment', (req, res) => {
    const { form: { name, phone_number }, currentOrder } = req.body;

    const getId = rows => rows[0].id;

    const getOrderQuantities = order_id => Object.entries(currentOrder).map(([dish_id, quantity]) => ({ dish_id, quantity, order_id }));

    knex.transaction(tx => {
      knex('clients')
        .transacting(tx)
        .returning('id')
        .insert({ name, phone_number })
        .then(getId)
        .then(client_id => knex('orders')
          .transacting(tx)
          .returning('id')
          .insert({ client_id })
          .then(getId))
        .then(order_id => knex('order_quantity')
          .transacting(tx)
          .insert(getOrderQuantities(order_id)))
          .then(() => tx.commit())
          .then(() => {
            res.json({ ok: true });
          })
        .catch(error => {
          tx.rollback();
          res.status(500).json({ error: true, message: error.message });
        });
      });
  });

  // router.post('/payment', (req, res) => {
  //   const dataBody = req.body;
  //   const customerName = dataBody.name;
  //   const customerPhone = dataBody.tel;
  //   const customerAddress = 'fake';
  //   console.log('Phone Number: ', customerPhone);
  //   let nextID;
  //   console.log('passed in order:', dataGlobal);
  //   knex('clients').returning('id').insert({ name: customerName, phone_number: customerPhone, address: customerAddress }).asCallback((err, row) => {
  //     if (err) {
  //       knex.destroy();
  //       return console.error('error inserting client', err);
  //     }

  //     console.log('New client successfully added');
  //     knex('clients').orderBy('id', 'desc').limit(1).asCallback((err, rows) => {
  //       const clientID = rows[0].id;
  //       knex('orders').insert({ client_id: clientID }).asCallback((err, rows) => {
  //         if (err) {
  //           knex.destroy();
  //           return console.error('error inserting order', err);
  //         }
  //         console.log('New order successfully added');
  //         knex('orders').orderBy('id', 'desc').limit(1).asCallback((err, rows) => {
  //           if (err) {
  //             knex.destroy();
  //             return console.error('error querying order id', err);
  //           }
  //           console.log(' orderID successfully grabbed');
  //           if (!(rows[0].id)) {
  //             nextID = 1;
  //           } else {
  //             nextID = (rows[0].id);

  //             dataGlobal.id.forEach((id_num) => {
  //               const qty = dataGlobal.quantity[id_num];
                // knex('order_quantity').insert({ quantity: qty, dish_id: id_num, order_id: nextID }).asCallback((err) => {
  //                 if (err) {
  //                   knex.destroy();
  //                   return console.error('error inserting into order_quantity table', err);
  //                 }
  //                 console.log('New order successfully added order quantity');
  //               });
  //             });
  //           }
  //         });
  //       });
  //     });
  //                 // knex.destroy();
  //   });

  //   console.log("Calling the restaurant");
  //   callResturant(customerName, customerPhone);
  //   res.redirect('/thankyou');

  // });

    //Commented so it doesnt call while testing the app

  router.post('/callcontent/:name/:phoneNum', (req, res) => {
// this object will be filled with database values;

    let reqName = req.params.name;
    let reqPhoneNumber = req.params.phoneNum;


    knex
    .select('orders.id')
    .from('orders')
    .join('clients', 'clients.id', '=', 'orders.client_id')
    .where('name', reqName)
    .andWhere('phone_number', reqPhoneNumber)
    .orderBy('id', 'desc')
    .limit(1)
    .asCallback((err, rows) => {
      if (err) {
        knex.destroy();
        return console.error('error inserting into order_quantity table', err);
      }
      console.log('New order successfully added order quantity');
      console.log('row:', rows);
      let dbOrderNumber = rows[0].id;
      knex
      .select('dishes.name')
      .from('dishes')
      .join('order_quantity', 'order_quantity.dish_id', '=', 'dishes.id')
      .join('orders', 'orders.id', '=', 'order_quantity.order_id')
      .join('clients', 'clients.id', '=', 'orders.client_id')
      .where('clients.name', reqName)
      .andWhere('clients.phone_number', reqPhoneNumber)
      .asCallback((err, rows) => {
        if (err) {
          knex.destroy();
          return console.error('error selecting name from dishes table', err);
        }
        let dishes = [];
        rows.forEach((dish)=> {
          dishes.push(dish.name);
        });
        knex
        .select('order_quantity.quantity')
        .from('order_quantity')
        .join('orders', 'orders.id', '=', 'order_quantity.order_id')
        .join('clients', 'clients.id', '=', 'orders.client_id')
        .where('clients.name', reqName)
        .andWhere('clients.phone_number', reqPhoneNumber)
        .asCallback((err, rows)=> {
          if (err) {
            // knex.destroy();
            console.error('error selecting name from dishes table', err);
            return res.status(500).json({error: 'Database made a poo poo'});
            
          }
          let quantity = [];
          rows.forEach((item)=> {
            quantity.push(item.quantity);
          });
          console.log("--------------Q:", quantity);
          console.log("-----------Dished:", dishes);
          const orderData = {
            orderNumber: dbOrderNumber,
            clientInfo: {
              name: reqName,
              phoneNumber: reqPhoneNumber,
              address: '128 W. Hastings Ave, Vancouver, BC'
            },
            dishes: dishes,
            quantity: quantity
          };

          res.set('Content-Type', 'text/xml');
          res.render('order', orderData);
        });
      });
    });
  });

  router.post('/call', (req, res) => {
    res.send('calling');
  });

  router.post('/customerupdate', (req, res) => {
    const clientMessage = `Thanks for your order 
    you order number is ${req.body.ordernumber}
    and will be ready in ${req.body.preptime} minutes`;
    sendSMS(clientMessage);
    res.redirect('/restaurant');
  });
  return router;
};
