var dbikes = angular.module('dbikes', ['ngAria', 'angularMoment', 'headroom']);

dbikes.controller('BikesController', ['$scope', '$filter', '$http', function($scope, $filter, $http) {

  var apiUrl = "http://api.citybik.es/v2/networks/dublinbikes";
  $scope.message = {
    text: ' ',
    time: ''
  };
  $scope.city = {};
  $scope.order = "distance";

  $scope.updateDistances = function(){
    for(var i = 0; i < $scope.stations.length; i++){
      $scope.stations[i].distance = $scope.distanceFrom($scope.stations[i]);
    }
  };
  $scope.reorder = function(_inList){
    var list = _inList || $scope.stations
    if($scope.stations != []) { $scope.updateDistances(); }
    $scope.stations = $filter('orderBy')(list, $scope.order);
    $scope.updateDistances();
    if(_inList != null){
      $scope.stations = $filter('orderBy')(list, $scope.order);
    }
  }
  $scope.update = function() {
    var response = $http.get(apiUrl);
    response.success(function(data, status, headers, config) {
      $scope.reorder(data.network.stations);
      $scope.city = data.network.location;
      $scope.message.time = new Date();
    });
    response.error(function(data, status, headers, config) {
      console.log("Updating data failed!");
    });
  };

  var oldPosition = [0,0];
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position){
      $scope.currentLocation = [position.coords.longitude, position.coords.latitude];
      if(position != oldPosition){
        $scope.reorder();
        var oldPosition = position;
      }
      return position;
    });
  }
  $scope.stations = []
  $scope.update();

  $scope.distanceFrom = function(_item, _startPoint) {
    var start = null;

    var radiansTo = function (start, end) {
      var d2r = Math.PI / 180.0;
      var lat1rad = start.latitude * d2r;
      var long1rad = start.longitude * d2r;
      var lat2rad = end.latitude * d2r;
      var long2rad = end.longitude * d2r;
      var deltaLat = lat1rad - lat2rad;
      var deltaLong = long1rad - long2rad;
      var sinDeltaLatDiv2 = Math.sin(deltaLat / 2);
      var sinDeltaLongDiv2 = Math.sin(deltaLong / 2);
      // Square of half the straight line chord distance between both points.
      var a = ((sinDeltaLatDiv2 * sinDeltaLatDiv2) +
        (Math.cos(lat1rad) * Math.cos(lat2rad) *
          sinDeltaLongDiv2 * sinDeltaLongDiv2));
      a = Math.min(1.0, a);
      return 2 * Math.asin(Math.sqrt(a));
    };

    if ($scope.currentLocation) {
      start = {
        longitude: $scope.currentLocation[0],
        latitude: $scope.currentLocation[1]
      };
    }
    start = _startPoint || start;

    var end = {
      longitude: _item.longitude,
      latitude: _item.latitude
    };

    var num = radiansTo(start, end) * 3958.8;
    return Math.round(num * 100) / 100;
  }
}]);

dbikes.filter('lowercasePossesion', function() {
  return function(input, all) {
    return input.replace(/'S/g, "'s");
  }
});