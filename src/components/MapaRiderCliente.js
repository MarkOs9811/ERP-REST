import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "250px",
  borderRadius: "12px",
};

const libreriasGoogle = ["places"]; // Puedes añadir "geometry" si más adelante haces cálculos matemáticos

export const MapaRiderCliente = ({
  latCliente,
  lngCliente,
  latRider = null,
  lngRider = null,
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    // Asegúrate de que esta variable exista en tu archivo .env
    googleMapsApiKey:
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "TU_API_KEY_AQUI",
    libraries: libreriasGoogle,
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);

  // Efecto para calcular la ruta entre el Rider y el Cliente
  useEffect(() => {
    // Si no tenemos las 4 coordenadas o el mapa no ha cargado, no calculamos la ruta
    if (
      !latCliente ||
      !lngCliente ||
      !latRider ||
      !lngRider ||
      !window.google
    ) {
      setDirectionsResponse(null);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: Number(latRider), lng: Number(lngRider) }, // Punto A: Rider
        destination: { lat: Number(latCliente), lng: Number(lngCliente) }, // Punto B: Cliente
        travelMode: window.google.maps.TravelMode.DRIVING, // Ruta para vehículos
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error("Error al calcular la ruta de Google Maps:", status);
        }
      },
    );
  }, [latCliente, lngCliente, latRider, lngRider]);

  if (loadError)
    return (
      <div className="text-center p-3 text-danger">
        Error de autenticación con Google Maps. Revisa tu API Key y Facturación.
      </div>
    );
  if (!isLoaded)
    return (
      <div className="text-center p-3 text-muted">
        Cargando mapa interactivo...
      </div>
    );

  // Centro por defecto (La ubicación del cliente)
  const center = { lat: Number(latCliente), lng: Number(lngCliente) };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15} // El zoom inicial (DirectionsRenderer lo ajustará automáticamente si hay ruta)
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        zoomControl: true,
        gestureHandling: "greedy",
      }}
    >
      {/* 🛣️ DIBUJAR LA RUTA */}
      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          options={{
            suppressMarkers: true, // OCULTA los marcadores A y B feos por defecto
            polylineOptions: {
              strokeColor: "#0D6EFD", // Color de la línea de la ruta (Azul tipo Google)
              strokeWeight: 5, // Grosor de la línea
            },
          }}
        />
      )}

      {/* 📍 MARCADOR DEL CLIENTE (ROJO) */}
      {latCliente && lngCliente && (
        <Marker
          position={{ lat: Number(latCliente), lng: Number(lngCliente) }}
          title="Ubicación de Entrega"
          icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
        />
      )}

      {/* 🛵 MARCADOR DEL RIDER (VERDE) */}
      {latRider && lngRider && (
        <Marker
          position={{ lat: Number(latRider), lng: Number(lngRider) }}
          title="Motorizado"
          icon={"http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
        />
      )}
    </GoogleMap>
  );
};
