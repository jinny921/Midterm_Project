
exports.up = function(knex) {
  return knex.schema.table("restaurant", (table) => {
    table.dropColumn('phone_number');
  })
};

exports.down = function(knex) {
};
