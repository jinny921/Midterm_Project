//appending dishes data, render order sidebar to home page
$(() => {
  const currentOrder = {};
  // const sms = require('send-sms').sendSMS;

  function ajaxCall(method, url, data, dataType) {
    return $.ajax({method, url, data, dataType});
  };

  function dishTemplate(dish) {
    return `<section class='col-xs-6 col-sm-4'>
              <div class='dish' data-dishid='${dish.id}'>
                <img class='dish-img' src='${dish.img_url}'>
                <div class='caption'>
                  <h4 class='dish-name'>${dish.name}</h4>
                </div>              
                <div class='dish-details'>
                  <p class='dish-desc'>${dish.description}</p>
                  <p class='dish-price'>Price: \$<span class='dishPrice'>${dish.price}</span></p>
                  <p class='dish-prep'>Prep Time: ${dish.preptime} mins (approx.)</p>
                </div>
                <div class='shop'>
                  <i class="fa fa-minus-square-o" aria-hidden="true"></i>
                  <span class='counter'>0</span>
                  <i class="fa fa-plus-square" aria-hidden="true"></i> 
                </div>
              </div>
            </section>`;
  };

  function cartTemplate(item) {
    return `<div class='dish' data-dishid='${item.id}'>
              <div class='caption'>
                <h4 class='dish-name'>${item.name}</h4>
                <div class='dish-details'>
                  <p class='dish-price'>Price: \$${item.price}</p>
                  <span class='counter'>Quantity: ${item.quantity}</span>
                </div>
              </div>              
            </div>`
  }

  function checkoutTemplate(total) {
    return `<form action="/payment" method="POST">
              <p>Total: ${total}</p>
              <input type="name" name="name" placeholder="Name">
              <input type="phone_number" name="phone_number" placeholder="Phone Number">
              <button type="submit" value="confirm-payment">Confirm</button>
            </form>`
  }

  function paintPage(res) {
    $('.menu-wrapper').append(res.map(dishTemplate));

    // function appendToCart(dish) {
    //   const dish = {
    //           id: dishID,
    //           name: dishName,
    //           price: dishPrice,
    //           quantity: newQuantity,
    //       };
    //   $('.cart-wrapper').append(cartTemplate(dish));
    // }

    $('.fa-minus-square-o').on('click', function() { 
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

    $('.fa-plus-square').on('click', function() { 
      const $that = $(this);
      const $counter = $that.siblings('.counter');
      const $menuContainer = $that.closest('[data-dishid]');
      const dishIDfromMenu = $menuContainer.data('dishid');
      const dishName = $that.parent().siblings().children('.dish-name').text();
      const dishPrice = +$that.parent().siblings().find('.dishPrice').text();
      const $cartContainer = $('.selected-dish');

      ajaxCall('PUT', '/orders')
        .then((res) => {
          const $currentVal = +$counter.text();
          const newVal = $currentVal + 1;
          $counter.text(newVal);
          const item = {
              id: dishIDfromMenu,
              name: dishName,
              price: dishPrice,
              quantity: newVal,
          };
          currentOrder[dishIDfromMenu] = item;
          let $dishInCart = $cartContainer.find('[data-dishid="' + dishIDfromMenu + '"]');

          if ($dishInCart.length) {
            $dishInCart.find('.counter').text('Quantity: '+ newVal);
          } else {
            $cartContainer.append(cartTemplate(item));
          }
        }, (err) => {
          console.error('we have a problem!!!')
        })
    });
  };

$('.btn-down').click(function() {

  $('html,body').animate({
    scrollTop: $('#menu').offset().top},'slow');
});

  ajaxCall('GET','/orders')
  .then((res) => {
    paintPage(res);
  }, (err) => {
    console.error(err);
  });

  function calculateTotal() {
    let total = 0;
    for (var prop in currentOrder) {
      var currObj = currentOrder[prop];
      total += currObj.price * currObj.quantity;
    }
    console.log(total);
    return total;
  }

  // Kevin's WIP place order function
  $('.place-order').on('click', function() {
    const $orderContainer = $('.order-confirmation');
    const currentTotal = calculateTotal();
    ajaxCall('POST', '/orders/checkout', currentOrder);
    $orderContainer.append(checkoutTemplate(currentTotal));
  });
});