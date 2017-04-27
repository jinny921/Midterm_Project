
exports.up = function(knex) {
  return knex.schema.createTable("order", (table) => {
    table.increments();
    // table.bigInteger('client').unsigned().index().references('id').inTable('dishes')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("order");
};
