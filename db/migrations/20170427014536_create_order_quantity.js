
exports.up = function(knex) {
  return knex.schema.createTable("clients", (table) => {
    table.increments();
    table.string('name');
    table.string('address');
    table.string('phone_number');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("clients");
};
