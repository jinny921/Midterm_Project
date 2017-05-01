// appending dishes data, render order sidebar to home page
$(() => {
  $(this).scrollTop(0);

  // Should use something like this!
  // const state = {
  //   currentOrder: {},
  //   menu: [],
  //   checkingOut: false
  // };
  
  var currentOrder = {};
  var menu = [];
  var checkingOut = false;
  // const sms = require('send-sms').sendSMS;

  function ajaxCall(method, url, data, dataType) {
    return $.ajax({
      method,
      url,
      data,
      dataType,
    });
  }

  function dishTemplate(dish) {
    const qty = currentOrder[dish.id] || 0;
    const canAdd = !checkingOut && qty < 10;
    const canRemove = !checkingOut && qty > 0;
    return `<section class='col-xs-6 col-md-4'>
              <div class='dish' data-dishid='${dish.id}'>
                <div class='dish-img-wrapper'><img class='dish-img' src='${dish.img_url}'></div>
                <div class='caption'>
                  <h4 class='dish-name'>${dish.name}</h4>
                </div>              
                <div class='dish-details'>
                  <p class='dish-desc'>${dish.description}</p>
                  <p class='dish-price'>Price: $<span class='dishPrice'>${dish.price}</span></p>
                  <p class='dish-prep'>Prep Time: ${dish.preptime} mins (approx.)</p>
                </div>
                <div class='shop'>
                  <i class="fa fa-minus-square-o ${canRemove ? '' : 'disabled'}" data-action="remove-dish" aria-hidden="true"></i>
                  <span class='counter'>${qty}</span>
                  <i class="fa fa-plus-square ${canAdd ? '' : 'disabled'}" data-action="add-dish" aria-hidden="true"></i> 
                </div>
              </div>
            </section>`;
  }

  function cartTemplate(id, qty) {
    const item = findItemById(id);
    // const { name, price } = item;
    // console.log(item, qty);
    const name = item.name;
    const price = item.price;

    return `<div class='dish' data-dishid='${id}'>
              <div class='caption'>
                <div class='dish-name'><i class="fa-li fa fa-remove" data-action="remove-item"></i>${name}</div>
                <div class='dish-details'>
                  <span class='dish-price'>Price: $${price}</span>
                  <span class='counter'> X ${qty}</span>
                </div>
              </div>              
            </div>`;
  }

  function checkoutTemplate(total) {
    if ($('.confirm-order').length) {
      return;
    }
    return `<form class='submit-payment' action='/orders/payment' method='POST'>
              <div class='submit-total'>Your total: $${total}</div>
                <div class='contact'>Contact info:</div>
                  <div class='form-name'>
                    <label for='name'>Name:</label>
                    <input class='form-control' id='name' type='text' name='name' placeholder='Name' required >
                  </div>
                  <div class='form-number'>
                    <label for='phone_number'>Phone Number:</label>
                    <input class='form-control' type='tel' min-length=10 id='phone_number' name='phone_number' pattern='[0-9,-]{10,12}' title='Please enter a valid phone number.' placeholder='555-555-5555' required >
                  </div>
                </div>
              <input class='btn btn-primary btn-lg btn-block pay-order' type='submit' role='button' value='Place Order'>
              </div>  
            </form>`;
    // return `<form class='submit-payment' action='/orders/payment' method='POST'>
    //           <div class='form-name'>
    //             <div class='submit-total'>Your total: $${total}</div>
    //             <div class='contact'>Contact info:</div>
    //               <label for='name'>Name:</label>
    //               <input class='form-control' id='name' type='text' name='name' placeholder='Name' required >
    //             </div>
    //           </div>
    //           <div class='form-number'>
    //             <label for='phone_number'>Phone Number:</label>
    //             <input class='form-control' type='tel' min-length=10 id='phone_number' name='tel' pattern='[0-9,-]{10,12}' title='Please enter a valid phone number.' placeholder='555-555-5555' required >
    //           </div>
    //           <input class='btn btn-primary btn-lg btn-block pay-order' type='submit' role='button' value='Place Order'>
    //         </form>`;
  }

  function findItemById(id) {
    return menu.find(item => item.id == id); //eslint-disable-line strict-comapre
  }

  function calculateTotal() {
    // let total = 0;
    // for (const prop in currentOrder) {
    //   const currObj = currentOrder[prop];
    //   total += currObj.price * currObj.quantity;
    // }
    // return total;
    return Object.entries(currentOrder).reduce((acc, [itemId, qty]) => {
      const item = findItemById(itemId);
      return acc + (item.price * qty);
    }, 0);
  }

  $('#menuItems').on('click', '[data-action="remove-dish"],[data-action="add-dish"]', function onPlusOrMinusClick(e) {
    if(checkingOut) { return; }
    const dishId = $(e.target).closest('[data-dishid]').data('dishid');
    const action = $(e.target).data('action');
    switch(action) {
      case 'add-dish':
        currentOrder[dishId] = (currentOrder[dishId] || 0) + 1;
        if(currentOrder[dishId] >= 10) {
          currentOrder[dishId] = 10;
        }
        break;
      case 'remove-dish':
        currentOrder[dishId] = (currentOrder[dishId] || 0) - 1;
        if(currentOrder[dishId] <= 0) {
          delete currentOrder[dishId];
        }
        break;
    }

    paintPage();
  });

  $('#orderItems').on('click', '[data-action="remove-item"]', function onOrderItemRemoved(e) {
    const dishId = $(e.target).closest('[data-dishid').data('dishid');
    delete currentOrder[dishId];

    paintPage();
  });

  $('#menu').on('submit', '.submit-payment', function onCheckoutFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const form = $(e.target).serializeArray().reduce((acc, { name, value }) => { acc[name] = value; return acc; }, {});
    const data = { form, currentOrder };

    $.post($(e.target).attr('action'), data)
      .then(result => {
        reset();
      }, error => {

      });
  });

  $('#clearCart').on('click', (e) => {
    currentOrder = {};
    paintPage();
  })

  function paintPage() {
    // console.log(currentOrder);
    renderMenu();
    if(checkingOut){
      renderCheckout();
    } else {
      renderCart();
    }
    const cartItemCount = Object.keys(currentOrder).length;
    $('#checkoutButton').attr('disabled', cartItemCount > 0 ? null : 'disabled');
  }
  
  function renderMenu() {
    $('#menuItems').empty().append(menu.map(dishTemplate));
  }

  function renderCart() {
    $('#orderItems').empty().append(Object.entries(currentOrder).map(([itemId, qty]) => {
      return cartTemplate(itemId, qty);
    }));
    const orderTotal = calculateTotal();
    $('#cart-total').text(orderTotal);
  }

  function renderCheckout() {
    $('#cart').empty().append(checkoutTemplate(calculateTotal()));
  }

  function reset() {
    currentOrder = {};
    checkingOut = false;
    paintPage();
  }

  ajaxCall('GET', '/orders')
    .then(res => {
      menu = res;
    })
    .then(paintPage)
    .catch(err => console.error(err));

  // proceed to checkout button
  $('#checkoutButton').on('click', () => {
    checkingOut = true;
    paintPage();
    // const $cartContainer = $('.cart-wrapper');
    // const currentTotal = calculateTotal();
    // if (currentTotal !== 0) {
      // $('.shop').fadeOut('400');
    //   ajaxCall('POST', '/orders/checkout', currentOrder);
    //   console.log('orders in cart:', currentOrder);
      // $cartContainer.empty().append(checkoutTemplate(currentTotal));
    // }
  });

  // NavBar transition effects
  $(window).on('scroll', () => {
    const header = $('header');
    const range = 200;
    const scrollTop = $(this).scrollTop();
    let offset = header.offset();
    const height = header.outerHeight();
    offset += height / 2;
    const calc = 1 - (scrollTop - offset + range) / range;

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

  // page scroll animation
  $('.btn-down').click(() => {
    $('html,body').animate({
      scrollTop: $('#menu').offset().top,
    }, 'slow');
  });

  // affix cart
  const $attribute = $('[data-smart-affix]');
  $attribute.each(function () {
    $(this).affix({
      offset: {
        top: $(this).offset().top + 70,
        right: $(this).offset().right,
      },
    });
  });

  $(window).on('resize', () => {
    $attribute.each(function () {
      $(this).data('bs.affix').options.offset = $(this).offset().top;
    });
  });
});
