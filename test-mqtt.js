const mqtt = require("mqtt");

console.log("Testing TCP port 8883...");
const clientTCP = mqtt.connect("mqtts://y12dbb61.ala.asia-southeast1.emqxsl.com:8883", {
  username: "table_T01",
  password: "scan4serve",
  clientId: "test_tcp_" + Math.random().toString(16).substr(2, 8)
});

clientTCP.on("connect", () => {
  console.log("✅ TCP 8883 Connected successfully!");
  clientTCP.end();
});
clientTCP.on("error", (err) => {
  console.log("❌ TCP 8883 Error:", err.message);
  clientTCP.end();
});

console.log("Testing WSS port 8084...");
const clientWSS = mqtt.connect("wss://y12dbb61.ala.asia-southeast1.emqxsl.com:8084/mqtt", {
  username: "table_T01",
  password: "scan4serve",
  clientId: "test_wss_" + Math.random().toString(16).substr(2, 8)
});

clientWSS.on("connect", () => {
  console.log("✅ WSS 8084 Connected successfully!");
  clientWSS.end();
});
clientWSS.on("error", (err) => {
  console.log("❌ WSS 8084 Error:", err.message);
  clientWSS.end();
});
