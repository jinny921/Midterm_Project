
exports.up = function(knex) {
  return knex.schema.table("dishes", (table) => {
    table.string('img_url');
  })
};

exports.down = function(knex) {
  return knex.schema.table("dishes", (table) => {
    table.string('img_url');
  })
};
