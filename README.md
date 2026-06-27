# GRIDSENSE AI SCADA Dashboard

**Balancing the Grid, Empowering Renewable Energy.**

This is a modern industrial SCADA dashboard designed to monitor an ESP32-based Edge AI Smart Phase Balancing System. It connects directly via MQTT using WebSockets to provide real-time updates without any browser refreshing.

## Features

- **Realtime MQTT Connection**: Instantly updates via WebSockets.
- **Edge AI Phase Balancing**: Displays the optimal phase ("R" or "B") and the rationale behind the AI's decision.
- **Phase Monitor Gauges**: Animated circular gauges for Voltage and Current, along with Health Score bars.
- **Live Telemetry Charts**: Real-time scrolling charts for Voltage and Current using Recharts.
- **Relay & Load Shift Animations**: Visual Framer Motion animations when load shifting occurs between phases.
- **Bonus Features**: CSV Export, Screenshot capture, Alarm Toasts, and Event Logs.
- **Dark Industrial Theme**: Built with a sleek, neon-accented glassmorphism aesthetic.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **MQTT Client**: MQTT.js

## Installation Guide

1. **Clone or Download the Project**:
   Ensure you are in the `gridsense-ai` directory.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Dashboard**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## MQTT Setup & Testing Instructions

The dashboard connects to the following EMQX broker by default:
- **Broker (WebSockets)**: `wss://y12dbb61.ala.asia-southeast1.emqxsl.com:8084/mqtt`
- **Username**: `table_T01`
- **Password**: `scan4serve`
- **Topic**: `restaurant/snmimt/table/1` (and `gridsense/live`)

*(Note: Browsers cannot connect directly to TCP port 8883, so Secure WebSockets on port 8084 is used).*

### Testing with MQTTX

To test the dashboard using MQTTX, use the following settings:

1. **Create a New Connection**:
   - **Name**: Gridsense AI Test
   - **Client ID**: `mqttx_test_client`
   - **Host**: `mqtts://y12dbb61.ala.asia-southeast1.emqxsl.com`
   - **Port**: `8883`
   - **Username**: `table_T01`
   - **Password**: `scan4serve`

2. **Publish a Test Message**:
   - **Topic**: `gridsense/live` (or `restaurant/snmimt/table/1`)
   - **Payload Type**: JSON
   - **Payload**:
     ```json
     {
       "time": "12:45:18",
       "date": "26-06-2026",
       "voltageR": 11.82,
       "voltageB": 10.43,
       "currentR": 1.22,
       "currentB": 0.95,
       "healthR": 7.92,
       "healthB": 6.80,
       "bestPhase": "R",
       "led1": "R",
       "led2": "R",
       "relayK1": true,
       "relayK2": false,
       "relayK3": false,
       "relayK4": true,
       "systemStatus": "Running",
       "switching": false,
       "lastShift": "B -> R"
     }
     ```

As soon as you hit "Publish", the Next.js dashboard will instantly react, animate the gauges, and update the live charts!
