
exports.up = function(knex) {
  return knex.schema.createTable("dishes", (table) => {
    table.increments();
    table.string('name');
    table.string('price');
    table.integer('preptime');
    table.bigInteger('restaurant_id').unsigned().index().references('id').inTable('restaurant')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("dishes");
};
