var map;
var bounds;
var data;
var imgs = {
  restaurants : '/images/restaurant.png',
  hotels: '/images/lodging_0star.png',
  activities: '/images/star-3.png'
}
var dayData = {};

$(document).ready(function() {
  initialize_gmaps();
});

$(".list-group").on("click", "button", function () {
  var parentToRemove = $(this).parent()
  var currDayNum = $("#num-day").text();
  var dayDataKey = parentToRemove.parent().attr("class").split(" ")[1];

  marker = dayData[currDayNum][dayDataKey];
  var ourCategoryList = dayData[currDayNum][dayDataKey];
  ourCategoryList.forEach(function(item){
    if (item[0].text() == parentToRemove.text()){
      item[1].setMap(null);
    }
    console.log(item[0].text());
    console.log(parentToRemove.text());
  });
  parentToRemove.remove();
})

$("#day-title").on("click","button", function () {
  var dayToRemove = $("#num-day").text();
  var buttonToRemove = $(".current-day");
  var numOfDays = $(".day-buttons").children().length - 1;



  if (numOfDays === 1){
    buttonToRemove.remove();
    addDay();
  }
  else {
    var newDay;
    if (dayToRemove == "1") newDay = buttonToRemove.next();
    else newDay = buttonToRemove.prev();
    daySwitch(newDay, newDay.text());
    buttonToRemove.remove();
  }




});

$(".addable").on("click","button", function() {
  var ourButton = $(this);
  var parent =  ourButton.parent()
  var valToAdd = parent.children("select").val();
  var typeToAdd = parent.attr("class").split(" ")[1];
  // day scenario
  if (typeToAdd === "day-buttons"){
    // plus day scenario
    if (ourButton.attr("id")){
      addDay();
      // var parentToAdd = $(".day-buttons.addable");
      // var placeToAddBefore = $("#plus");
      // var thingToAdd = $('<button class="btn btn-circle day-btn">'+parentToAdd.children().length+'</button>')
      // thingToAdd.insertBefore(placeToAddBefore);  
      // daySwitch(thingToAdd);   
    }
    // number day scenario
    else {
      // modification if clicking a different day.
      if (!ourButton.hasClass("current-day")){
        daySwitch(ourButton);
      } 

    }
  }
  // hotel, restaurant and activity to add case
  else {
    if(!data){
      data = {
        restaurants: all_restaurants,
        hotels: all_hotels,
        activities: all_activities
      }
    }

    var placeToAdd = $(".list-group."+typeToAdd);
    var thingToAdd = $('<div class="itinerary-item"><span class="title">' + valToAdd + '</span><button class="btn btn-xs btn-danger btn-circle ">x</button></div>');
    var ourItem = data[typeToAdd].filter(function(elem){
      return elem.name == valToAdd;
    });

    // find day we are adding to.
    // Append that info to data.
    var currDay = $(".day-buttons .current-day");
    var currDayNum = currDay.text();
    if (!dayData[currDayNum]){
      dayData[currDayNum] = {};
    }
    if (!dayData[currDayNum][typeToAdd]){
      dayData[currDayNum][typeToAdd] = [];
    }


    var ourLocation = ourItem[0].place[0].location;
    var marker = drawLocation (ourLocation, {icon: imgs[typeToAdd]} )
    // thingToAdd.data("dataMarker",marker);

    dayData[currDayNum][typeToAdd].push([thingToAdd,marker]);
    placeToAdd.append(thingToAdd);
  }
})

function addDay(){
      var parentToAdd = $(".day-buttons.addable");
      var placeToAddBefore = $("#plus");
      var thingToAdd = $('<button class="btn btn-circle day-btn">'+parentToAdd.children().length+'</button>')
      thingToAdd.insertBefore(placeToAddBefore);  
      daySwitch(thingToAdd);  
}

function daySwitch(newDay, dayNum){
  var parent =  newDay.parent()
  parent.children(".current-day").removeClass("current-day");
  
  clearMapOfDay();

  // var dayInfoToRemove = dayData[$("#num-day").text()];
  // if (dayInfoToRemove){ 
  //   Object.keys(dayInfoToRemove).forEach(function(category){
  //     dayInfoToRemove[category].forEach(function(item){
  //       item[1].setMap(null);
  //     })
  //   })
  // }


  newDay.addClass("current-day");

  var listGroupCategories = ["hotels", "restaurants", "activities"];
  for (var i = 0 ; i < listGroupCategories.length; i++){
    var currentList = $(".list-group."+listGroupCategories[i]);
    currentList.empty();
    if (dayData[newDay.text()]){
      var thingsToAdd = dayData[newDay.text()][listGroupCategories[i]];
      if (thingsToAdd){
        thingsToAdd.forEach(function(thing){
          currentList.append(thing[0]);
          thing[1].setMap(map);
        })   
      }
    }
  }
  $("#num-day").text(newDay.text());
}

function clearMapOfDay(){
  var dayInfoToRemove = dayData[$("#num-day").text()];
  if (dayInfoToRemove){ 
    Object.keys(dayInfoToRemove).forEach(function(category){
      dayInfoToRemove[category].forEach(function(item){
        item[1].setMap(null);
      })
    })
  }
}

function drawLocation (location, opts) {
  if (typeof opts !== 'object') {
    opts = {}
  }
  opts.position = new google.maps.LatLng(location[0], location[1]);
  opts.map = map;
  var marker = new google.maps.Marker(opts);
  bounds.extend(marker.position);
  map.fitBounds(bounds);
  return marker;
}













function initialize_gmaps() {
  // initialize new google maps LatLng object
  var myLatlng = new google.maps.LatLng(40.705189,-74.009209);
  // set the map options hash
  var mapOptions = {
    center: myLatlng,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  };
  // get the maps div's HTML obj
  var map_canvas_obj = document.getElementById("map-canvas");
  // initialize a new Google Map with the options
  map = new google.maps.Map(map_canvas_obj, mapOptions);
  // Add the marker to the map
  var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!"
  });
  bounds = new google.maps.LatLngBounds();
}

var styleArr = [{
  featureType: "landscape",
  stylers: [{
    saturation: -100
  }, {
    lightness: 60
  }]
}, {
  featureType: "road.local",
  stylers: [{
    saturation: -100
  }, {
    lightness: 40
  }, {
    visibility: "on"
  }]
}, {
  featureType: "transit",
  stylers: [{
    saturation: -100
  }, {
    visibility: "simplified"
  }]
}, {
  featureType: "administrative.province",
  stylers: [{
    visibility: "off"
  }]
}, {
  featureType: "water",
  stylers: [{
    visibility: "on"
  }, {
    lightness: 30
  }]
}, {
  featureType: "road.highway",
  elementType: "geometry.fill",
  stylers: [{
    color: "#ef8c25"
  }, {
    lightness: 40
  }]
}, {
  featureType: "road.highway",
  elementType: "geometry.stroke",
  stylers: [{
    visibility: "off"
  }]
}, {
  featureType: "poi.park",
  elementType: "geometry.fill",
  stylers: [{
    color: "#b6c54c"
  }, {
    lightness: 40
  }, {
    saturation: -40
  }]
}];
