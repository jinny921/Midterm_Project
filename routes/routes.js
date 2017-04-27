"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

//getting dishes data from database for home page
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("dishes")
      .then((dishes) => {
        res.json(results);
    });
  });

//getting order data from database after clicking checkout
  router.post("/checkout", (req, res) => {
    knex
      .select("*")
      .from("orders")
      .then((orders) => {
        res.json(orders);
      });
  });

  router.post("/orderConfirm", (req, res) => {
    knex
      .select("*")
  })

  return router;
}
