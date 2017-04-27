
exports.up = function(knex) {
  return knex.schema.table("dishes", (table) => {
    table.dropColumn('price');
  })
};

exports.down = function(knex) {
};
