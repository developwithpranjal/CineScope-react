import { useState } from "react";

function LocationData() {
  const [Location, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GEO_KEY;

  function getLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setLocation({ lat, lng });

          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${API_KEY}`,
          );

          const data = await res.json();

          const components = data.results[0].components;

          const cityName =
            components.city || components.town || components.village;

          setCity(cityName);
        } catch (err) {
          setError("Error fetching location");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
  }

  return { Location, city, error, loading, getLocation };
}

export default LocationData;