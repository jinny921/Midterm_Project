
exports.up = function(knex) {
  return knex.schema.table("order_quantity", (table) => {
    table.bigInteger('order_id').unsigned().index().references('id').inTable('order')  })
};

exports.down = function(knex) {
  return knex.schema.table("order_quantity", (table) => {
    table.increments();
    table.integer('quantity');
    table.bigInteger('dish_id').unsigned().index().references('id').inTable('dishes');
  })
};
