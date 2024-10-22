import { useState, useEffect } from "react";

interface Location {
  lat: number | null;
  lng: number | null;
}

interface GeolocationHook {
  location: Location;
  error: string | null;
}

const useGeolocation = (): GeolocationHook => {
  const [location, setLocation] = useState<Location>({ lat: null, lng: null });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError("User denied the request for Geolocation.");
          break;
        case error.POSITION_UNAVAILABLE:
          setError("Location information is unavailable.");
          break;
        case error.TIMEOUT:
          setError("The request to get user location timed out.");
          break;
        default:
          setError("An unknown error occurred.");
      }
    };

    const geoWatchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError
    );

    return () => {
      navigator.geolocation.clearWatch(geoWatchId);
    };
  }, []);

  return { location, error };
};

export default useGeolocation;
