//appending dishes data, render order sidebar to home page
$(() => {

  function ajaxCall(method, url, data, dataType) {
    return $.ajax({method, url, data, dataType});
  };

  function dishTemplate(dish) {
    return `<section class='col-sm-6 col-sm-4'>
              <div class='dish' data-dishId='${dish.id}'>
                <img src='${dish.img_url}'>
                <div class='caption'>
                  <h4 class='dish-name'>${dish.name}</h4>
                  <div class='shop'>
                    <i class="fa fa-minus-square-o" aria-hidden="true"></i>
                    <span class='counter'>0</span>
                    <i class="fa fa-plus-square" aria-hidden="true"></i> 
                  </div>
                  <div class='dish-details'>
                    <p class='dish-desc'>${dish.description}</p>
                    <p class='dish-price'>Price: \$${dish.price}</p>
                    <p class='dish-prep'>Prep Time: ${dish.preptime} mins (approx.)</p>
                  </div>
                </div>              
              </div>
            </section>`;
  };

  function cartTemplate(dish) {
    return `<section class='col-sm-6 col-sm-4'>
              <div class='dish' data-dishId='${dish.id}'>
                <div class='caption'>
                  <h4 class='dish-name'>${dish.name}</h4>
                  <div class='dish-details'>
                    <p class='dish-price'>Price: \$${dish.price}</p>
                    <span class='counter'>0</span>
                  </div>
                </div>              
              </div>
            </section`
  }

  function paintPage(res) {
    $('.menu-wrapper').append(res.map(dishTemplate));

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
      //const dishID = $that.parent().parent();
      const dishID = $that.parent().parent().parent().attr('data-dishId');
      // const dishName = $('.dish-name').text();
      const dishName = $that.parent().siblings('.dish-name').text();
      const dishPrice = $that.parent().siblings().children('.dish-price').text();
      console.log(dishName);
      var dish = {
          id: dishID,
          name: dishName,
          price: dishPrice,
      };
      ajaxCall('PUT', '/orders')
        .then((res) => {
          const $currentVal = +$counter.text();
          const newVal = $currentVal + 1;
          $counter.text(newVal);
          // $that.addClass('addedToCart');
          // const itemID = $('.cart-wrapper').closest('dish').data('dishId');
          console.log(dishID);
          // if(itemID !== dishID) {
            $('.cart-wrapper').append(cartTemplate(dish));
            $('.quantity').text(newVal);
          // } else {
          //   $('.price').text(newVal);
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

});

