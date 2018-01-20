let amenitiesChecked = {};
let statesChecked = {};
let citiesChecked = {};
let cityStateNames = [];

let monthOfYear = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'November',
  'December'
];

function numStNdRdTh (n) {
  switch (n % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

const amenityIcons = {
  'Cable TV': 'fa-television',
  'Lockbox': 'fa-key',
  'Internet': 'fa-globe',
  'Other pet(s)': 'fa-paw',
  'Smartlock': 'fa-lock',
  'Private living room': 'fa-home',
  'Pets live on this property': 'fa-exclamation-circle',
  'Self Check-In': 'fa-user-circle-o',
  'TV': 'fa-television',
  'Cat(s)': 'fa-paw',
  'Hot tub': 'fa-tint',
  'Gym': 'fa-heart',
  'Essentials': 'fa-shopping-basket',
  'Heating': 'fa-fire',
  'Family/kid friendly': 'fa-users',
  'Wireless Internet': 'fa-wifi',
  'Pets allowed': 'fa-paw',
  'Kitchen': 'fa-cutlery',
  'Doorman Entry': 'fa-bell',
  'Lock on bedroom door': 'fa-lock',
  'Washer': 'fa-tint',
  'Wheelchair accessible': 'fa-wheelchair-alt',
  'Elevator in building': 'fa-building',
  'Fire extinguisher': 'fa-fire-extinguisher',
  'Free parking on premises': 'fa-car',
  '24-hour check-in': 'fa-clock-o',
  'Keypad': 'fa-keyboard-o',
  'Air conditioning': 'fa-snowflake-o',
  'Suitable for events': 'fa-handshake-o',
  'Laptop friendly workspace': 'fa-laptop',
  'Breakfast': 'fa-coffee',
  'Smoke detector': 'fa-shield',
  'Shampoo': 'fa-shower',
  'Safety card': 'fa-phone-square',
  'Iron': 'fa-magic',
  'Dog(s)': 'fa-paw',
  'Hangers': 'fa-home',
  'Buzzer/wireless intercom': 'fa-microphone',
  'Carbon monoxide detector': 'fa-shield',
  'Indoor fireplace': 'fa-fire',
  'Private entrance': 'fa-exchange',
  'Dryer': 'fa-magic',
  'Doorman': 'fa-bell',
  'Hair dryer': 'fa-sun-o',
  'Pool': 'fa-tint',
  'Smoking allowed': 'fa-heartbeat',
  'First aid kit': 'fa-medkit'
};

$(() => {
  $('.amenities input[type=checkbox]').click(function () {
    if (this.checked) {
      amenitiesChecked[this.dataset.id] = this.dataset.name;
    } else {
      delete amenitiesChecked[this.dataset.id];
    }
    $('.amenities h4').text(Object.values(amenitiesChecked).join(', '));
  });

  $('.locations > ul > li > input[type=checkbox]').click(function () {
    if (this.checked) {
      statesChecked[this.dataset.id] = this.dataset.name;
      cityStateNames.push(this.dataset.name);
    } else {
      delete statesChecked[this.dataset.id];
      cityStateNames.splice(cityStateNames.indexOf(this.dataset.name), 1);
    }
    $('.locations h4').text(cityStateNames.join(', '));
  });

  $('.locations > ul > li > ul > li > input[type=checkbox]').click(function () {
    if (this.checked) {
      citiesChecked[this.dataset.id] = this.dataset.name;
      cityStateNames.push(this.dataset.name);
    } else {
      delete citiesChecked[this.dataset.id];
      cityStateNames.splice(cityStateNames.indexOf(this.dataset.name), 1);
    }
    $('.locations h4').text(cityStateNames.join(', '));
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
    reqObj.states = Object.keys(statesChecked);
    reqObj.cities = Object.keys(citiesChecked);
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
    // ------------ Get each place listing and insert into DOM ----------
    data.forEach(function (place) {
      const placeArticle = $(document.createElement('article'));
      const placeH2 = $(document.createElement('h2')).text(place.name);
      placeArticle.append(placeH2);

      const priceByNightDiv = $(document.createElement('div'))
        .addClass('price_by_night');
      const priceByNightP = $(document.createElement('p'))
        .text(`$${place.price_by_night}`);
      priceByNightDiv.append(priceByNightP);

      placeArticle.append(priceByNightDiv);

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

      placeArticle.append(informationDiv);

      // ------------ Get owner's name to place before description ------------
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

      // ------------ Description of place -------------------
      const descriptionDiv = $(document.createElement('div'))
        .addClass('description');
      const descriptionP = $(document.createElement('p'))
        .html(place.description);
      descriptionDiv.append(descriptionP);

      placeArticle.append(descriptionDiv);

      // ------------ Get list of amenities associated with place ----------
      const placeId = place.id;
      const amenitiesDiv = $(document.createElement('div'))
        .addClass('amenities');
      $.ajax({
        url: `http://0.0.0.0:5001/api/v1/places/${placeId}/amenities`,
        type: 'GET',
        dataType: 'json'
      })
        .done(function (data) {
          const amenitiesTitleH2 = $(document.createElement('h2'))
            .text('Amenities');
          const amenitiesListUl = $(document.createElement('ul'));
          data.forEach(function (amenity) {
            const amenityLi = $(document.createElement('li'));
            const amenityIcon = $(document.createElement('i'))
              .addClass(`fa ${amenityIcons[amenity.name]}`);
            const amenitySpan = $(document.createElement('span'))
              .text(amenity.name);
            amenityLi.append(amenityIcon);
            amenityLi.append(amenitySpan);
            amenitiesListUl.append(amenityLi);
          });
          amenitiesDiv.append(amenitiesTitleH2);
          amenitiesDiv.append(amenitiesListUl);
          descriptionDiv.after(amenitiesDiv);
          amenitiesDiv.after(reviewsDiv);
        });

      // ------------- Get all reviews associated with place ------------
      const reviewsDiv = $(document.createElement('div'))
        .addClass('reviews');
      const reviewsTitleH2 = $(document.createElement('h2'))
        .text('Reviews');
      const reviewsButton = $(document.createElement('button'));
      const reviewsButtonText = $(document.createElement('span'))
        .text('show');
      reviewsButton.append(reviewsButtonText);
      reviewsDiv.append(reviewsTitleH2);
      reviewsDiv.append(reviewsButton);
      $('section.places').append(placeArticle);

      reviewsButton.click(function (e) {
        if (reviewsButtonText.text() === 'hide') { // Fetch reviews
          reviewsButtonText.text('show');
          reviewsTitleH2.text('Reviews');
          $(this).nextAll().remove();
        } else if (reviewsButtonText.text() === 'show') { // Hide reviews
          reviewsButtonText.text('hide');
          const reviewsListUl = $(document.createElement('ul'));
          $.ajax({
            url: `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`,
            type: 'GET',
            dataType: 'json'
          })
            .done(function (reviews) {
              let numberOfReviews = reviews.length;
              reviewsTitleH2.text(`${numberOfReviews} ${numberOfReviews === 1 ? 'Review' : 'Reviews'}`);
              reviews.forEach(function (review) {
                // --------- Get name of user that wrote current review -------
                const userId = review.user_id;
                $.ajax({
                  url: `http://0.0.0.0:5001/api/v1/users/${userId}`,
                  type: 'GET',
                  dataType: 'json'
                })
                  .done(function (user) {
                    let updatedAt = new Date(review.updated_at);
                    let date = updatedAt.getDate() +
          numStNdRdTh(updatedAt.getDay());
                    let month = monthOfYear[updatedAt.getMonth()];
                    let year = updatedAt.getFullYear();
                    let fullDate = `${date} ${month} ${year}`;
                    const reviewLi = $(document.createElement('li'));
                    const reviewH3 = $(document.createElement('h3'))
                      .text(`By ${user.first_name} ${user.last_name} on ${fullDate}`);
                    const reviewP = $(document.createElement('p'))
                      .html(review.text);
                    reviewLi.append(reviewH3);
                    reviewLi.append(reviewP);
                    reviewsListUl.append(reviewLi);
                  });
              });
              reviewsDiv.append(reviewsListUl);
            });
        }
      });
    });
  }
});
