//appending dishes data to home page
$(() => {
  $.ajax({
    method: "GET",
    url: "/home"
  }).done((users) => {
      $("<div>").text(users).appendTo($("body"));
  });;
});

//passing order info to checkout page
$('checkoutBtn').on('submit', (event) => {
  $.ajax({
    method: "POST",
    url: "/home/checkout"
  }).done((order) => {

  });
});

//passing confirmed order to confirmation page
$('confirmBtn').on('submit', (event) => {
  $.ajax({
    method: "POST",
    url: "/home/orderConfirm"
  }).done((confirmation) => {

  });
});