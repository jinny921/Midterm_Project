//appending dishes data, render order sidebar to home page
$(() => {

  function ajaxCall(method, url, data, dataType) {
    return $.ajax({method, url, data, dataType});
  };

  function dishTemplate(dish) {
    return `<section class='col-sm-4'>
              <div class='dish'>
                <img src='${dish.img_url}' alt='burrito'>
                <div class='caption'>
                  <h4>${dish.name}</h4>
                  <p>\$${dish.price}</p>
                  <p>${dish.description}</p>
                </div>
                <div>
                  <i class="fa fa-minus" aria-hidden="true"></i>
                  <span class='counter'>0</span>
                  <i class="fa fa-plus" aria-hidden="true"></i> 
                </div>
              </div>
            </section>`
  };

  function paintPage(res) {
    $('.menu-wrapper').append(res.map(dishTemplate));

    $('.fa-minus').on('click', function() { 
      const $that = $(this);
      const $counter = $that.siblings('.counter');
      ajaxCall('PUT', '/orders')
        .then((res) => {
          const $currentVal = +$counter.text();
          if($currentVal > 0) {
            const newVal = $currentVal - 1;
            $counter.text(newVal);
          } else {
            $that.addClass('inactive');
          }
        }, (err) => {
          console.error('we have a problem!!!')
        })
    });

    $('.fa-plus').on('click', function() { 
      const $that = $(this);
      const $counter = $that.siblings('.counter');
      ajaxCall('PUT', '/orders')
        .then((res) => {
          const $currentVal = +$counter.text();
          const newVal = $currentVal + 1;
          $counter.text(newVal);
        }, (err) => {
          console.error('we have a problem!!!')
        })
    });
  }

  $.ajax({
    method: "GET",
    url: "/orders"
  }).then((res) => {
    paintPage(res);
  }, (err) => {
    console.error(err);
  })
});

// //receive user's picks (quantity and dish), display on order sidebar
// function renderOrderList(order) {

// }
// //update order list, re-render sidebar

// //submit final order list, press checkout button, pass order info to /checkout
// $('checkoutBtn').on('submit', (event) => {
//   $.ajax({
//     method: "POST",
//     url: "/checkout"
//   }).then((order) => {
//       console.log("order", order);
//   }, (err) => {
//     console.error(err);
//   })
// });

// //passing payment info, confirm payment, render order confirmation page
// $('paymentBtn').on('submit', (event) => {
//   $.ajax({
//     method: "POST",
//     url: "/payment"
//   }).done((paymentInfo) => {
//     render
//   });
// });