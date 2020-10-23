const getRelativeDistance = (locations, marker) => {

    const latLng = marker.latLng;
    const distance = distanceMtrs(
      latLng.longitude,
      latLng.latitude,
      locations[0].coords.longitude,
      locations[0].coords.latitude
    );

    const adjustedDistance = distanceMinusAccuracy(
      distance,
      locations[0].coords.accuracy
    );
    console.log("Adjusted:", adjustedDistance, "meters", 'Radius: ', marker.radius);
  return adjustedDistance;
};

//gives the distance in meters between 2 coordinates
const distanceMtrs = (long1, lat1, long2, lat2) => {
  const d = Math.pow(lat2 - lat1, 2) + Math.pow(long2 - long1, 2);
  return Math.pow(d, 0.5) * 110.574 * 1000;
};

//adjusts for margin of error when location is only accurate to Xmeters
const distanceMinusAccuracy = (distance, accuracy) => {
  var difference = distance - accuracy;
  difference < 0 && (difference = 0);
  return difference;
};

export default { getRelativeDistance };