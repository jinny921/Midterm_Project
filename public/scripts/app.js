//appending dishes data, render order sidebar to home page
$(() => {

  function dishTemplate(dish) {
    return `<section class='col-sm-4'>
              <div class='dish'>
                <img src='${dish.img_url}' alt='burrito'>
                <div class='caption'>
                  <h3>${dish.name}</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias molestiae ullam similique ipsa, ex modi,
                    maxime, eum voluptates harum odit dolore saepe nemo nesc</p>
                </div>
                <p>\$${dish.price}</p>
                <p><a href='#' class='btn btn-primary' role='button'>Button</a> <a href='#' class='btn btn-default' role='button'>Button</a></p>
              </div>
            </section>`
  };

  function paintPage(res) {
    $('.menu-wrapper').append(res.map(dishTemplate));
  };


  $.ajax({
    method: "GET",
    url: "/orders"
  }).then((res) => {
    paintPage(res);
  }, (err) => {
    console.error(err);
  })
});

//receive user's picks (quantity and dish), display on order sidebar
function renderOrderList(order) {

}
//update order list, re-render sidebar

//submit final order list, press checkout button, pass order info to /checkout
$('checkoutBtn').on('submit', (event) => {
  $.ajax({
    method: "POST",
    url: "/checkout"
  }).then((order) => {
      console.log("order", order);
  }, (err) => {
    console.error(err);
  })
});

//passing payment info, confirm payment, render order confirmation page
$('paymentBtn').on('submit', (event) => {
  $.ajax({
    method: "POST",
    url: "/payment"
  }).done((paymentInfo) => {
    render
  });
});