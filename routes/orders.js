"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

//getting dishes data from database for home page (/ = /orders)
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("dishes")
      .then((dishes) => {
        res.json(dishes);
    });
  });

//update order list with selected dishes
  router.put("/", (req, res) => {
    knex
      .select("name", "price")
      .from("dishes")
      .then((selected) => {
        res.json(selected);
      });
  });
  
//getting order data from database after clicking checkout
  router.post("/checkout", (req, res) => {
    // knex('order_quantity')
    // .insert($(/* shopping cart items dish_ids */))
    // knex.destroy();
  });

  router.post("/payment", (req, res) => {
    knex
      .select("*")
  })

  return router;
}
