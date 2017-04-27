exports.seed = function(knex, Promise) {
  const deleteTablePromise = Promise.all([
      knex('restaurant').del(),
      knex('dishes').del()
    ]);
  return deleteTablePromise
    .then(function () {
      const insertUsersPromise = Promise.all([
        knex('restaurant').insert({name: 'Maenam', address: '217 E Georgia Street', phone_number: 6045698192}),
        knex('dishes').insert({name: 'Pad Thai', preptime: 45, img_url: 'http://s3.amazonaws.com/btoimage/prism-thumbnails/articles/20170211-khaosanroad-07.jpg-resize_then_crop-_frame_bg_color_FFF-h_1365-gravity_center-q_70-preserve_ratio_true-w_2048_.jpg', price: 16,}),
        knex('dishes').insert({name: 'Massaman Curry of Braised Beef', preptime: 50, img_url: 'http://s3.amazonaws.com/btoimage/prism-thumbnails/articles/20170211-khaosanroad-07.jpg-resize_then_crop-_frame_bg_color_FFF-h_1365-gravity_center-q_70-preserve_ratio_true-w_2048_.jpg', price: 22,}),
        knex('dishes').insert({name: 'Chicken Cashew Stirfry', preptime: 45, img_url: 'https://www.rowsehoney.co.uk/rowse2017/wp-content/uploads/2015/10/58-Chicken-and-cashew-Stir-Fry@2x.jpg', price: 19,}),
      ]);
      return insertUsersPromise;
    });
};
