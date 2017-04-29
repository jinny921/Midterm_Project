

exports.up = function(knex) {
  return knex.schema.createTable("orders", (table) => {
    table.increments();
    // table.bigInteger('client_id').unsigned().index().references('id').inTable('clients');
    table.integer('client_id').unsigned();
    table.foreign('client_id').references('clients.id');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("orders");
};
