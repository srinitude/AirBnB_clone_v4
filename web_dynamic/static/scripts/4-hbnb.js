let amenitiesChecked = {};
$(() => {
  $('input[type=checkbox]').click(function () {
    if (this.checked) {
      amenitiesChecked[this.dataset.id] = this.dataset.name;
    } else {
      delete amenitiesChecked[this.dataset.id];
    }
    $('.amenities h4').text(Object.values(amenitiesChecked).join(', '));
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    dataType: 'json'
  })
    .done(function (data) {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      }
    });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    data: JSON.stringify({}),
    contentType: 'application/json',
    dataType: 'json'
  })
    .done(getPlaces);

  $('button').click(function (e) {
    let reqObj = {};
    reqObj.amenities = Object.keys(amenitiesChecked);
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify(reqObj),
      contentType: 'application/json',
      dataType: 'json'
    })
      .done(getPlaces);
  });

  function getPlaces (data) {
    data.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
    $('section.places article').remove();
    data.forEach(function (place) {
      const article = $(document.createElement('article'));
      const placeH2 = $(document.createElement('h2')).text(place.name);
      article.append(placeH2);

      const priceByNightDiv = $(document.createElement('div'))
        .addClass('price_by_night');
      const priceByNightP = $(document.createElement('p'))
        .text(`$${place.price_by_night}`);
      priceByNightDiv.append(priceByNightP);

      article.append(priceByNightDiv);

      const informationDiv = $(document.createElement('div'))
        .addClass('information');
      const maxGuestDiv = $(document.createElement('div'))
        .addClass('max_guest');
      const guestImageDiv = $(document.createElement('div'))
        .addClass('guest_image');
      const maxGuestP = $(document.createElement('p'))
        .text(`${place.max_guest}`);
      maxGuestDiv.append(guestImageDiv);
      maxGuestDiv.append(maxGuestP);
      informationDiv.append(maxGuestDiv);

      const numberRoomsDiv = $(document.createElement('div'))
        .addClass('number_rooms');
      const bedImageDiv = $(document.createElement('div'))
        .addClass('bed_image');
      const numberRoomsP = $(document.createElement('p'))
        .text(`${place.number_rooms}`);
      numberRoomsDiv.append(bedImageDiv);
      numberRoomsDiv.append(numberRoomsP);
      informationDiv.append(numberRoomsDiv);

      const numberBathroomsDiv = $(document.createElement('div'))
        .addClass('number_bathrooms');
      const bathImageDiv = $(document.createElement('div'))
        .addClass('bath_image');
      const numberBathroomsP = $(document.createElement('p'))
        .text(`${place.number_bathrooms}`);
      numberBathroomsDiv.append(bathImageDiv);
      numberBathroomsDiv.append(numberBathroomsP);
      informationDiv.append(numberBathroomsDiv);

      article.append(informationDiv);

      const userId = place.user_id;
      $.ajax({
        url: `http://0.0.0.0:5001/api/v1/users/${userId}`,
        type: 'GET',
        dataType: 'json'
      })
        .done(function (data) {
          const userDiv = $(document.createElement('div'))
            .addClass('user');
          const content = `<b>Owner: </b>${data.first_name} ${data.last_name}`;
          const ownerP = $(document.createElement('p'))
            .html(content);
          userDiv.append(ownerP);

          informationDiv.after(userDiv);
        });

      const descriptionDiv = $(document.createElement('div'))
        .addClass('description');
      const descriptionP = $(document.createElement('p'))
        .html(place.description);
      descriptionDiv.append(descriptionP);

      article.append(descriptionDiv);

      $('section.places').append(article);
    });
  }
});
