import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Esto es necesario para que Echo encuentre Pusher
window.Pusher = Pusher;

const echoEvents = new Echo({
  broadcaster: "pusher",
  key: "3a474e6680223eaa4e3f", // 👉 Tu llave de siempre
  cluster: "eu", // 👉 Tu cluster de siempre
  forceTLS: true,

  
  // authEndpoint: "http://erp-api.test/api/broadcasting/auth",
  authEndpoint: "http://127.0.0.1:8000/api/broadcasting/auth",
  auth: {
    headers: {
      // El token para que Laravel sepa quién está escuchando
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  },
});

export default echoEvents;
