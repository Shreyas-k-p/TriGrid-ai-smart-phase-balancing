export interface GridsensePayload {
  time: string;
  date: string;
  voltageR: number;
  voltageY: number;
  voltageB: number;
  currentR: number;
  currentY: number;
  currentB: number;
  healthR: number;
  healthY: number;
  healthB: number;
  bestPhase: "R" | "Y" | "B";
  led1: "R" | "Y" | "B" | "OFF";
  led2: "R" | "Y" | "B" | "OFF";
  relayK1: boolean;
  relayK2: boolean;
  relayK3: boolean;
  relayK4: boolean;
  systemStatus: "Running" | "Stopped" | "Switching" | "Fault";
  switching: boolean;
  lastShift: string;
}

export interface MQTTConnectionState {
  status: "Connected" | "Disconnected" | "Connecting" | "Error";
  packetsReceived: number;
  lastPayload: GridsensePayload | null;
  history: GridsensePayload[]; // last 60 readings
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  type: "INFO" | "WARNING" | "ALARM" | "SHIFT";
  message: string;
}
