//appending dishes data, render order sidebar to home page
$(() => {

  function dishTemplate(dish) {
    return `<section class='col-sm-6 col-md-4'>
              <div class='dish'>
                <img src='${dish.img_url}'>
                <div class='caption'>
                  <h4 class='dish-name'>${dish.name}</h4>
                  <h4 class='dish-price'>\$${dish.price}</h4>
                  <p class='dish-desc'>${dish.description}</p>
                </div>
                <div>
                 <i class='fa fa-minus' aria-hidden='true'></i>
                 <i class='fa fa-plus' aria-hidden='true'></i>
                </div>
              </div>
            </section>`;
  };

  function paintPage(res) {
    $('.menu-wrapper').append(res.map(dishTemplate));
  };


  $.ajax({
    method: 'GET',
    url: '/orders'
  }).then((res) => {
    paintPage(res);
  }, (err) => {
    console.error(err);
  })
});

//receive user's picks (quantity and dish), display on order sidebar
function renderOrderList(order) {

}

// Select all links with hashes
$('#btn-down').click(function (event) {
  // On-page links
  if (
    location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
    location.hostname == this.hostname
  ) {
    // Figure out element to scroll to
    var target = $('#menu');
    // Does a scroll target exist?
    if (target.length) {
      // Only prevent default if animation is actually gonna happen
      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000, function () {
        // Callback after animation
        // Must change focus!
        var $target = $(target);
        $target.focus();
        if ($target.is(":focus")) { // Checking if the target was focused
          return false;
        } else {
          $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
          $target.focus(); // Set focus again
        };
      });
    }
  }
});

//update order list, re-render sidebar

//submit final order list, press checkout button, pass order info to /checkout
$('checkoutBtn').on('submit', (event) => {
  $.ajax({
    method: 'POST',
    url: '/checkout'
  }).then((order) => {
    console.log('order', order);
  }, (err) => {
    console.error(err);
  })
});

//passing payment info, confirm payment, render order confirmation page
$('paymentBtn').on('submit', (event) => {
  $.ajax({
    method: 'POST',
    url: '/payment'
  }).done((paymentInfo) => {
    render
  });
});
