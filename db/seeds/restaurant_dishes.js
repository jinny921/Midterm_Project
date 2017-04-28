exports.seed = function(knex, Promise) {
  const deleteTablePromise = Promise.all([
      knex('restaurants').del(),
      knex('clients').del(),
      knex('dishes').del(),
      knex('orders').del(),
      knex('order_quantity').del(),
    ]);
  return deleteTablePromise
    .then(function () {
      const insertDataPromise = Promise.all([
        knex('restaurants').insert({id: 1, name: 'Maenam', address: '217 E Georgia Street', phone_number: '604-569-8192'}),
        knex('clients').insert({id: 1, name: 'Kevin Morissette', address: '128 W Hastings Ave, Vancouver, BC', phone_number: '514-928-5254'}),
        knex('dishes').insert({id: 1, name: 'Pad Thai', preptime: 45, img_url: 'http://i.imgsafe.org/25a5bf1c7c.jpg', price: 16, description: 'fresh rice noodles, tamarind, peanuts, tofu, egg, prawns', restaurant_id: 1}),
        knex('dishes').insert({id: 2, name: 'Massaman Curry of Braised Beef', preptime: 50, img_url: 'http://img.taste.com.au/YLyVbGax/taste/2016/11/slow-cooker-massaman-beef-curry-85846-1.jpeg', price: 22, description: 'roasted peanut, potato confit, longan, roasted onion', restaurant_id: 1}),
        knex('dishes').insert({id: 3, name: 'Chicken Cashew Stirfry', preptime: 45, img_url: 'http://i.imgsafe.org/25a2b2c3f1.jpg', price: 19, description: 'fresh baby corn, green peppercorn, thai basil', restaurant_id: 1}),
        knex('dishes').insert({id: 4, name: 'Green Papaya Salad', preptime: 30, img_url: 'https://www.maangchi.com/wp-content/uploads/2011/12/mangosomtam1.jpg', price: 12, description: "long beans, carrots, garlic, roasted peanuts, bird's eye chilies, dried shrimp", restaurant_id: 1}),
        knex('dishes').insert({id: 5, name: 'Thai-style Tuna Ceviche', preptime: 35, img_url: 'https://cincinletseat.files.wordpress.com/2011/05/img_6250.jpg', price: 14, description: 'served on crackers, toasted rice powder, lemongrass, kaffir lime leaf', restaurant_id: 1}),
        knex('dishes').insert({id: 6, name: 'Tom Gati of Coconut and Chicken Soup', preptime: 35, img_url: 'https://cdn.instructables.com/ORIG/FUB/T8XN/G0IPADZX/FUBT8XNG0IPADZX.jpg', price: 19, description: 'galangal, lemongrass, young coconut, variety of mushrooms, chili jam', restaurant_id: 1}),
        knex('orders').insert({id: 1, client_id: 1}),
        knex('order_quantity').insert({id: 1, order_id: 1, dish_id: 1, quantity: 2}),
        knex('order_quantity').insert({id: 2, order_id: 1, dish_id: 3, quantity: 5}),
      ]);
      return insertDataPromise;
    });
};

// first make a promise that only seeds the restaurant and client
//
