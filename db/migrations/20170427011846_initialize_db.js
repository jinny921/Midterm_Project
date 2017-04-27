
exports.up = function(knex) {
  return knex.schema.createTable("restaurant", (table) => {
    table.increments();
    table.string('name');
    table.string('address');
    table.integer('phone_number');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("restaurant");
};
