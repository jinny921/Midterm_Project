
exports.up = function(knex) {
  return knex.schema.table("dishes", (table) => {
    table.string('description');
  })
};

exports.down = function(knex) {
  return knex.schema.table("dishes", (table) => {
    table.string('description');
  })
};
