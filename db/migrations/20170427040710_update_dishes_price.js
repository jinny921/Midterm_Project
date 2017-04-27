
exports.up = function(knex) {
  return knex.schema.table("dishes", (table) => {
    table.string('price');
  })
};

exports.down = function(knex) {
  return knex.schema.table("dishes", (table) => {
    table.string('price');
  })
};
