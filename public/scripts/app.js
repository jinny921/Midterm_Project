// appending dishes data, render order sidebar to home page
$(() => {
  const currentOrder = {};
  // const sms = require('send-sms').sendSMS;

  function ajaxCall(method, url, data, dataType) {
    return $.ajax({ method, url, data, dataType });
  }

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
  }

  function cartTemplate(item) {
    return `<div class='dish' data-dishid='${item.id}'>
              <div class='caption'>
                <li class='dish-name'><i class="fa-li fa fa-check-circle-o"></i>${item.name}</li>
                <div class='dish-details'>
                  <li>
                    <span class='dish-price'>Price: \$${item.price}</span>
                    <span class='counter'> X ${item.quantity}</span>
                  </li>
                </div>
              </div>              
            </div>`;
  }

  function checkoutTemplate(total) {
    if ($('.confirm-order').length) {
      return;
    }
    return `<form action='/orders/checkout' method='POST'>
              <div class='form-group'>
                <label for='name'>Your Name:</label>
                <input class='form-control' id='name' type='text' name='name' placeholder='Name'>
              </div>
              <div class='form-group'>
                <label for='phone_number'>Phone:</label>
                <input class='form-control' type='tel' id='phone_number' name='phone_number' placeholder='(555) 555-5555'>
              </div>
              <div>Total: ${total}</div>
              <input class='btn btn-primary pay-order' type='submit' role='button' value='Pay'>
            </form>`;
  }

  function calculateTotal() {
    let total = 0;
      for (const prop in currentOrder) {
        const currObj = currentOrder[prop];
        total += currObj.price * currObj.quantity;
      }
    console.log(total);
    return total;
  };

  function paintPage(res) {
    $('.menu-wrapper').append(res.map(dishTemplate));

    $('.fa-minus-square-o').on('click', function() {
      const $that = $(this);
      const $counter = $that.siblings('.counter');
      const $menuContainer = $that.closest('[data-dishid]');
      const dishIDfromMenu = $menuContainer.data('dishid');
      const dishName = $that.parent().siblings().children('.dish-name').text();
      const dishPrice = +$that.parent().siblings().find('.dishPrice').text();
      const $cartContainer = $('.selected-dish');

      ajaxCall('PUT', '/orders')
        .then((res) => {
          const $currentVal = 0 + $counter.text();
          if ($currentVal > 0) {
            const newVal = $currentVal - 1;
            $counter.text(newVal);
            let $dishInCart = $cartContainer.find('[data-dishid="' + dishIDfromMenu + '"]');
            const currentQuantity = (!$dishInCart) ? 0 : currentOrder[dishIDfromMenu].quantity;

            if (currentQuantity > 1) {
              $dishInCart.find('.counter').text('Quantity: ' + newVal);
            } else if (currentQuantity === 1) {
              $dishInCart.remove();
            }
          currentOrder[dishIDfromMenu].quantity--;
          } else {
            $that.addClass('inactive');
          }
          let total = calculateTotal();
          $('#cart-total').text(total);
        }, (err) => {
          console.error('we have a problem!!!');
        });
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
            $dishInCart.find('.counter').text(' X ' + newVal);
          } else {
            $cartContainer.append(cartTemplate(item));
          }
          let total = calculateTotal();
          $('#cart-total').text(total);
        }, (err) => {
          console.error('we have a problem!!!');
        });
    });
  }

  $('.btn-down').click(() => {
    $('html,body').animate({
      scrollTop: $('#menu').offset().top }, 'slow');
  });

  ajaxCall('GET', '/orders')
  .then((res) => {
    paintPage(res);
  }, (err) => {
    console.error(err);
  });


  // Kevin's WIP place order function
  $('.place-order').on('click', function(event) {
    const $cartContainer = $('.cart-wrapper');
    const currentTotal = calculateTotal();
    ajaxCall('POST', '/orders/checkout', currentOrder);
    $cartContainer.empty().append(checkoutTemplate(currentTotal));
  });


  // NavBar transition effects
  $(window).on('scroll', function () {
    const header = $('header');
    const range = 200;
    let scrollTop = $(this).scrollTop();
    let offset = header.offset();
    let height = header.outerHeight();
    offset = offset + height / 2;
    let calc = 1 - (scrollTop - offset + range) / range;

    header.css({
      opacity: calc,
    });

    if (calc > '1') {
      header.css({
        opacity: 1,
      });
    } else if (calc < '0') {
      header.css({
        opacity: 0,
      });
    }
  });
});
