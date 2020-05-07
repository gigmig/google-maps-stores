var map;
var markers = [];
var infoWindow;
var locationSelect;
var darkModeEnabled;
console.log(stores);
window.onload = () => {
  // deleteAllCookies();
  checkDarkMode();
  document.getElementById('darkmode').addEventListener('click', function(){
    var darkModeChecked = document.querySelector('#darkmode').checked;
    document.cookie = `darkMode = ${darkModeChecked}`;
    darkModeEnabled = !darkModeEnabled;
    initMap();
  });
  // displayStores();
  // setOnClickListener();
  var input = document.getElementById('zip-code-input');
  input.addEventListener('keyup', (e) => {
    // console.log(e);
    if (e.keyCode == 13) {
      let zipCode = this;
      console.log('This:', this);
      console.log('This: input', input.value);
      searchStores();
      return false;
    }
  });
  // $('#zip-code-input').on('keyup', (e) => {
  //   if (e.keyCode == 13) {
  //     alert('zzz');
  //     return false;
  //   }
  // });
}
function deleteAllCookies() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}
function initMap() {
    var myLatLng = {lat: 34.0522, 
        lng: -118.1437
    };
    var losAngeles = {
        lat: 34.0522, 
        lng: -118.2437
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: 'roadmap',
        styles: darkModeEnabled ? darkModeStyles : null
        // styles: darkMode
    });
    infoWindow = new google.maps.InfoWindow();
    // displayStores();
    // showStoresMarkers();
    // setOnClickListener();
    searchStores();
}
function searchStores(params) {
  var foundStores = [];
  var zipCode = document.getElementById('zip-code-input').value;
  if(zipCode){
    for(var store of stores){
      var postal = store.address.postalCode.substring(0, 5);
      if(postal == zipCode){
        foundStores.push(store);
      }
    }
  } else {
    foundStores = stores;
  }
  clearLocations();
  displayStores(foundStores);   
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocations() {
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener(){
  var storeElements = document.querySelectorAll('.store-container');
  storeElements.forEach(function(elem, index) {
    elem.addEventListener('click', function(){
      google.maps.event.trigger(markers[index], 'click');
    });
  });
}
function displayStores(stores){
  var storesHtml = '';
  for(var [index, store] of stores.entries()){
      var address = store['addressLines'];
      var phone = store['phoneNumber'];
      storesHtml += `
      <div class="store-container">
        <div class="store-container-background">
            <div class="store-info-container">
                <div class="store-address">
                    <span>${address[0]}</span>
                    <span>${address[1]}</span>
                </div>
                <div class="store-phone-number">
                    ${phone}
                </div>
            </div>
            <div class="store-number-container">
                <div class="store-number">
                    ${++index}
                </div>
            </div>
          </div>
      </div>
      `;
      document.querySelector('.stores-list').innerHTML = storesHtml;
    }
}
function showStoresMarkers(stores){
    var bounds = new google.maps.LatLngBounds();
    for(var [index, store] of stores.entries()){
        var latlng = new google.maps.LatLng(
            parseFloat(store['coordinates']['latitude']),
            parseFloat(store['coordinates']['longitude'])
        );
        var name = store['name'];
        var address = store['addressLines'][0];
        var openStatusText = store['openStatusText'];
        var phoneNumber = store['phoneNumber'];
        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, phoneNumber, ++index);
    }
    map.fitBounds(bounds);
}
function createMarker(latlng, name, address, openStatusText, phoneNumber, index){
    var html = `<div class="store-info-window">
        <div class="store-info-name">${name}</div>
        <div class="store-info-status">${openStatusText}</div>
        <div class="store-info-address">
          <div class="circle">
            <i class="fas fa-location-arrow"></i>
          </div>
          ${address}
        </div>
        <div class="store-info-phone">
          <div class="circle">
            <i class="fas fa-phone-alt"></i>
          </div>
          ${phoneNumber}
        </div>
      </div>`;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: index.toString(),

    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}
// Moi funkcii
function checkDarkMode(){
  if(document.cookie.includes('darkMode=true')){
    darkModeEnabled = true;
    document.querySelector('#darkmode').checked = true;
    initMap();
  }
}
function matchZip(zip){ //TODO
  for(var i = 0; i < stores.length; i++){
    if(zip == stores[i].address.postalCode.substring(0, 5)){
      return stores[i];
    }
  }
  return false;
}

