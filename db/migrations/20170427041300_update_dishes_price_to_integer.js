
exports.up = function(knex) {
  return knex.schema.table("dishes", (table) => {
    table.integer('price');
  })
};

exports.down = function(knex) {
  return knex.schema.table("dishes", (table) => {
    table.integer('price');
  })
};
