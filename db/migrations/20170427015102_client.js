

exports.up = function(knex) {
  return knex.schema.createTable("order_quantity", (table) => {
    table.increments();
    table.integer('quantity');
    table.bigInteger('order_id').unsigned().index().references('id').inTable('orders');
    table.bigInteger('dish_id').unsigned().index().references('id').inTable('dishes');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("order_quantity");
};
