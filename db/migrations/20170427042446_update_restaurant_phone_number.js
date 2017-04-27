
exports.up = function(knex) {
  return knex.schema.table("restaurant", (table) => {
    table.bigInteger('phone_number');
  })
};

exports.down = function(knex) {
  return knex.schema.table("restaurant", (table) => {
    table.bigInteger('phone_number');
  })
};
