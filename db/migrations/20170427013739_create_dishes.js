
exports.up = function(knex) {
  return knex.schema.createTable("dishes", (table) => {
    table.increments();
    table.string('name');
    table.integer('price');
    table.integer('preptime');
    table.string('img_url');
    table.string('description');
    table.bigInteger('restaurant_id').unsigned().index().references('id').inTable('restaurants')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("dishes");
};
