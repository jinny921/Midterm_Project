
exports.up = function(knex) {
  return knex.schema.table("restaurant", (table) => {
    table.string('phone_number');
  })
};

exports.down = function(knex) {
  return knex.schema.table("restaurant", (table) => {
    table.string('phone_number');
  })
};
