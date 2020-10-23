import storage from "./storage";

//const latLng = { latitude: 51.8787992, longitude: -8.4518733 };

const getRelativeDistance = async (data) => {
  const asyncMarkers = await storage.get("asyncMarkers");

  for (var i = 0; i < asyncMarkers.length; i++) {
    const latLng = asyncMarkers[i].latLng;
    const distance = distanceMtrs(
      latLng.longitude,
      latLng.latitude,
      data.locations[0].coords.longitude,
      data.locations[0].coords.latitude
    );

    const adjustedDistance = distanceMinusAccuracy(
      distance,
      data.locations[0].coords.accuracy
    );
    console.log("Adjusted:", adjustedDistance, "meters");
  }
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

export { getRelativeDistance };