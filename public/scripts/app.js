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
                <div>
                  <i class="fa fa-minus" aria-hidden="true"></i>
                  <span class='counter'>0</span>
                  <i class="fa fa-plus" aria-hidden="true"></i> 
                </div>
              </div>
            </section>`;
  };

  function cartTemplate(dish) {
    return `<ul>
              <li>
              <li>Food Item 1: [placeholder]</li>
              <li><span class="price"</span></li>
              <li>Quantity: [xx]</li>
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
      ajaxCall('PUT', '/orders')
        .then((res) => {
          const $currentVal = +$counter.text();
          const newVal = $currentVal + 1;
          $counter.text(newVal);
          const dishID = $that.closest('dish').data('dishId');
          if(dish.id) {
            $('.cart-wrapper').append(cartTemplate);

          }
          $('.price').text(newVal);
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

