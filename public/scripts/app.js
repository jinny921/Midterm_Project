//appending dishes data, render order sidebar to home page
$(() => {

  function ajaxCall(method, url, data, dataType) {
    return $.ajax({method, url, data, dataType});
  };

  function dishTemplate(dish) {
    return `<section class='col-xs-6 col-sm-4'>
              <div class='dish' data-dishId='${dish.id}'>
                <img class='dish-img' src='${dish.img_url}'>
                <div class='caption'>
                  <h4 class='dish-name'>${dish.name}</h4>
                </div>              
                <div class='dish-details'>
                  <p class='dish-desc'>${dish.description}</p>
                  <p class='dish-price'>Price: \$${dish.price}</p>
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
    return `<section class='col-sm-6 col-sm-4'>
              <div class='dish' data-dishId='${item.id}'>
                <div class='caption'>
                  <h4 class='dish-name'>${item.name}</h4>
                  <div class='dish-details'>
                    <p class='dish-price'>Price: \$${item.price}</p>
                    <span class='counter'>${item.quantity}</span>
                  </div>
                </div>              
              </div>
            </section`
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
      const $cart = $('.cart-wrapper').children('.col-sm-4');
      const dishID = $that.parent().parent().parent().attr('data-dishId');
      const dishName = $that.parent().siblings('.dish-name').text();
      const dishPrice = $that.parent().siblings().children('.dish-price').text();
      // const dishQuantity = updatedQuantity;

      ajaxCall('PUT', '/orders')
        .then((res) => {
          const $currentVal = +$counter.text();
          const newVal = $currentVal + 1;
          $counter.text(newVal);
          const item = {
              id: dishID,
              name: dishName,
              price: dishPrice,
              quantity: newVal,
          };

          for (var selectedDish in $cart) {
          console.log($cart);
            // if () {
            // } else {
            //   item.quantity = newVal;
            // }
          }

          $('.cart-wrapper').append(cartTemplate(item));
          // } else {
          //   item.quantity = newVal;
          // }
        }, (err) => {
          console.error('we have a problem!!!')
        })
    });
  };

  $.ajax({
    method: 'GET',
    url: '/orders'
  }).then((res) => {
    paintPage(res);
  }, (err) => {
    console.error(err);
  });

  $('.btn-down').click(function() {

    $('html,body').animate({
        scrollTop: $('#menu').offset().top},
        'slow');
  });


  // $(window).on('scroll', function () {
  //   let header = $('header');
  //   let range = 200;
  
  //   let scrollTop = $(this).scrollTop();
  //   let offset = header.offset().top;
  //   let height = header.outerHeight();
  //   offset = offset + height / 2;
  //   let calc = 1 - (scrollTop - offset + range) / range;
  
  //   header.css({ 'opacity': calc });
  
  //   if ( calc > '1' ) {
  //     header.css({ 'opacity': 1 });
  //   } else if ( calc < '0' ) {
  //     header.css({ 'opacity': 0 });
  //   }
  // });
});

