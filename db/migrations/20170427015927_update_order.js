
exports.up = function(knex) {
  return knex.schema.table("order", (table) => {
    table.bigInteger('client').unsigned().index().references('id').inTable('dishes')
  })
};

exports.down = function(knex) {
  return knex.schema.table("order", (table) => {
    table.increments();
  })
};
