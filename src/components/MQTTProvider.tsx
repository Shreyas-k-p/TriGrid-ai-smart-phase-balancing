"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import mqtt, { MqttClient } from "mqtt";
import { GridsensePayload, MQTTConnectionState, SystemEvent } from "@/types/mqtt";
import { toast } from "react-hot-toast";

interface MQTTContextType extends MQTTConnectionState {
  events: SystemEvent[];
  client: MqttClient | null;
  topic: string;
  updateConnection: (broker: string, user: string, pass: string) => void;
  publishMessage: (topic: string, message: string) => void;
  brokerUrl: string;
  brokerUser: string;
}

const MQTTContext = createContext<MQTTContextType | undefined>(undefined);

const DEFAULT_BROKER = "wss://y12dbb61.ala.asia-southeast1.emqxsl.com:8084/mqtt";
const DEFAULT_USER = "table_T01";
const DEFAULT_PASS = "scan4serve";
const MQTT_TOPIC = "gridsense/live";

// Alternative local topic as requested: "gridsense/live"
// We will subscribe to all of them to be safe.

export const MQTTProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<MQTTConnectionState>({
    status: "Connecting",
    packetsReceived: 0,
    lastPayload: null,
    history: [],
  });

  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [client, setClient] = useState<MqttClient | null>(null);

  const addEvent = (type: SystemEvent["type"], message: string) => {
    setEvents((prev) => {
      const newEvent = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
      };
      return [newEvent, ...prev].slice(0, 100); // Keep last 100 events
    });
  };

  const [brokerUrl, setBrokerUrl] = useState("");
  const [brokerUser, setBrokerUser] = useState("");
  const [brokerPass, setBrokerPass] = useState("");

  useEffect(() => {
    setBrokerUrl(localStorage.getItem("mqtt_broker") || DEFAULT_BROKER);
    setBrokerUser(localStorage.getItem("mqtt_user") || DEFAULT_USER);
    setBrokerPass(localStorage.getItem("mqtt_pass") || DEFAULT_PASS);
  }, []);

  const updateConnection = (broker: string, user: string, pass: string) => {
    localStorage.setItem("mqtt_broker", broker);
    localStorage.setItem("mqtt_user", user);
    localStorage.setItem("mqtt_pass", pass);
    setBrokerUrl(broker);
    setBrokerUser(user);
    setBrokerPass(pass);
    if (client) {
      client.end(true);
    }
  };

  const publishMessage = (topic: string, message: string) => {
    if (client && client.connected) {
      client.publish(topic, message);
      console.log(`Published to ${topic}: ${message}`);
    } else {
      toast.error("Cannot publish: MQTT client not connected.");
    }
  };

  useEffect(() => {
    if (!brokerUrl) return;

    console.log("Connecting to MQTT broker...", brokerUrl);
    
    const mqttClient = mqtt.connect(brokerUrl, {
      username: brokerUser,
      password: brokerPass,
      reconnectPeriod: 2000,
      connectTimeout: 5000,
      clean: true,
      clientId: `gridsense_web_${Math.random().toString(16).slice(3)}`,
    });

    setClient(mqttClient);

    mqttClient.on("connect", () => {
      setState((s) => ({ ...s, status: "Connected" }));
      addEvent("INFO", "Connected to MQTT Broker");
      
      mqttClient.subscribe(["gridsense/live", "restaurant/snmimt/table/1", "restaurant/snmimt/table/T01"], (err) => {
        if (!err) {
          console.log("Subscribed to topics");
        }
      });
      
      toast.success("ESP32 Connected via MQTT");
    });

    mqttClient.on("reconnect", () => {
      setState((s) => ({ ...s, status: "Connecting" }));
    });

    mqttClient.on("disconnect", () => {
      setState((s) => ({ ...s, status: "Disconnected" }));
      addEvent("WARNING", "MQTT Disconnected");
    });

    mqttClient.on("error", (err) => {
      setState((s) => ({ ...s, status: "Error" }));
      addEvent("ALARM", `MQTT Error: ${err.message}`);
      toast.error("Connection Error. Reconnecting automatically...");
    });

    mqttClient.on("message", (topic, message) => {
      try {
        const payloadStr = message.toString();
        // Assume all incoming messages are JSON gridsense payload for now
        const data = JSON.parse(payloadStr) as GridsensePayload;
        
        setState((s) => {
          const newHistory = [...s.history, data].slice(-60); // keep last 60 for charts
          
          // Detect Faults or Shifts for Events
          if (s.lastPayload) {
            if (s.lastPayload.bestPhase !== data.bestPhase) {
               addEvent("SHIFT", `Phase shifted to ${data.bestPhase}`);
               toast.success(`Load Shift Successful: ${data.lastShift}`);
            }
            if (data.systemStatus === "Fault" && s.lastPayload.systemStatus !== "Fault") {
               addEvent("ALARM", "Sensor Fault Detected!");
               toast.error("System Fault Detected!");
            }
          }

          return {
            ...s,
            packetsReceived: s.packetsReceived + 1,
            lastPayload: data,
            history: newHistory,
          };
        });
      } catch (e) {
        console.error("Failed to parse MQTT message", e);
      }
    });

    return () => {
      mqttClient.end();
    };
  }, [brokerUrl, brokerUser, brokerPass]);

  return (
    <MQTTContext.Provider value={{ ...state, events, client, topic: "gridsense/live", updateConnection, publishMessage, brokerUrl, brokerUser }}>
      {children}
    </MQTTContext.Provider>
  );
};

export const useMQTT = () => {
  const context = useContext(MQTTContext);
  if (!context) throw new Error("useMQTT must be used within MQTTProvider");
  return context;
};
