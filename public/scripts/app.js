//appending dishes data, render order sidebar to home page
$(() => {

  function dishTemplate(dish) {
    return `<div class="content">
                <h3>${dish.name}</h3>
                <img src='${dish.img_url}'>
            </div>`
  };

  function paintPage(res) {
    $('#dishes').append(res.map(dishTemplate));
  };


  $.ajax({
    method: "GET",
    url: "/orders"
  }).then((res) => {
    paintPage(res);
      console.log("res", res);
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