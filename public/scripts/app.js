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
                  <h4 class='dish-price'>\$${dish.price}</h4>
                  <p class='dish-desc'>${dish.description}</p>
                </div>
                <div dataid="10">
                  <i class="fa fa-minus" aria-hidden="true"></i>
                  <span class='counter'>0</span>
                  <i class="fa fa-plus" aria-hidden="true"></i> 
                </div>
              </div>
            </section>`;
  };

  function cartTemplate(dish) {
    return `<ul>
              <li data-itemId='${dish.id}'></li>
              <li>Food Item 1: ${dish.name}</li>
              <li>Price: ${dish.price}</li>
              <li>Quantity:<span class="quantity"</span></li>
              <li>Total: [$xx]</li>
            </ul>`
  }

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
      //const dishID = $that.parent().parent();
      const dishID = $that.parent().parent().attr('data-dishId');
      var dish = {
          id: dishID,
          name: "jinny dish"
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

