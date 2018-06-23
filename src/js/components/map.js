function setMarker(map, position, info) {
  var marker = new google.maps.Marker({
    position: position,
    map: map
  });
  var infowindow = new google.maps.InfoWindow({
    content: info
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

function getMap(info) {
  var map = new google.maps.Map(document.getElementById('order-map'), {
    zoom: 18
  });

  setMarker(map, info.from.coords, 'Начало пути<br>'+info.from.addr);
  setMarker(map, info.to.coords, 'Конец пути<br>' + info.to.addr);

  var bounds = new google.maps.LatLngBounds();
  bounds.extend(info.from.coords);
  bounds.extend(info.to.coords);
  map.fitBounds(bounds);

  var flightPath = new google.maps.Polyline({
    path: info.coords,
    geodesic: true,
    strokeColor: '#252C92',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  flightPath.setMap(map);
}

export default getMap;
