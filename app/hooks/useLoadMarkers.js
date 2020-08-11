import { useState, useEffect } from "react";
import storage from "../utility/storage";

const useLoadMarkers = () => {
  const [markers, setMarkers] = useState([]);

  const loadMarkers = async () => {
    try {
      const asyncMarkers = await storage.get("asyncMarkers");
      asyncMarkers
        ? setMarkers(asyncMarkers)
        : console.log("No saved markers.");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadMarkers();
  }, []);

  return markers;
};

export default useLoadMarkers;
