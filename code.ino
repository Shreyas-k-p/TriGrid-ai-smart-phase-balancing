#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// -------------------------
// Voltage Sensors
// -------------------------
#define VR_PIN 34
#define VY_PIN 35
#define VB_PIN 32

// -------------------------
// Current Sensors
// -------------------------
#define CR_PIN 33
#define CY_PIN 25
#define CB_PIN 26

// -------------------------
// Relay Board 1
// -------------------------
#define R1_K1 23
#define R1_K2 18
#define R1_K3 19

// -------------------------
// Relay Board 2
// -------------------------
#define R2_K1 4
#define R2_K2 5
#define R2_K3 13

// -------------------------
// OLED
// -------------------------
TwoWire OLED_I2C = TwoWire(0);

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64

Adafruit_SSD1306 display(
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  &OLED_I2C,
  -1
);

String phaseStatus = "START";

// =====================================
// Bulb Switching Functions
// =====================================

void bulb1_R() {
  digitalWrite(R2_K1, LOW);
  delay(100);
  digitalWrite(R1_K1, HIGH);
}

void bulb1_B() {
  digitalWrite(R1_K1, LOW);
  delay(100);
  digitalWrite(R2_K1, HIGH);
}

void bulb2_Y() {
  digitalWrite(R2_K2, LOW);
  delay(100);
  digitalWrite(R1_K2, HIGH);
}

void bulb2_R() {
  digitalWrite(R1_K2, LOW);
  delay(100);
  digitalWrite(R2_K2, HIGH);
}

void bulb3_B() {
  digitalWrite(R2_K3, LOW);
  delay(100);
  digitalWrite(R1_K3, HIGH);
}

void bulb3_Y() {
  digitalWrite(R1_K3, LOW);
  delay(100);
  digitalWrite(R2_K3, HIGH);
}

// =====================================

void showStartup() {
  display.clearDisplay();

  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);

  display.setCursor(10, 15);
  display.println("TRIPHASE");

  display.setCursor(5, 40);
  display.println("SMARTGRID");

  display.display();

  delay(3000);
}

// =====================================

void setup() {
  Serial.begin(115200);

  pinMode(R1_K1, OUTPUT);
  pinMode(R1_K2, OUTPUT);
  pinMode(R1_K3, OUTPUT);

  pinMode(R2_K1, OUTPUT);
  pinMode(R2_K2, OUTPUT);
  pinMode(R2_K3, OUTPUT);

  digitalWrite(R1_K1, LOW);
  digitalWrite(R1_K2, LOW);
  digitalWrite(R1_K3, LOW);

  digitalWrite(R2_K1, LOW);
  digitalWrite(R2_K2, LOW);
  digitalWrite(R2_K3, LOW);

  // OLED I2C
  OLED_I2C.begin(27, 14, 100000);

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED FAILED");
    while (true);
  }

  showStartup();
}

// =====================================

float readVoltage(int pin) {
  int adc = analogRead(pin);

  return ((float)adc / 4095.0) * 12.0;
}

float readCurrent(int pin) {
  int adc = analogRead(pin);

  return ((float)adc / 4095.0) * 5.0;
}

// =====================================

void loop() {

  float vr = readVoltage(VR_PIN);
  float vy = readVoltage(VY_PIN);
  float vb = readVoltage(VB_PIN);

  float cr = readCurrent(CR_PIN);
  float cy = readCurrent(CY_PIN);
  float cb = readCurrent(CB_PIN);

  // ---------------------
  // Phase Health Scores
  // ---------------------

  float scoreR = (0.7 * (vr / 12.0))
               - (0.3 * (cr / 5.0));

  float scoreY = (0.7 * (vy / 12.0))
               - (0.3 * (cy / 5.0));

  float scoreB = (0.7 * (vb / 12.0))
               - (0.3 * (cb / 5.0));

  // ---------------------
  // Decision Logic
  // ---------------------

  if (scoreR >= scoreY && scoreR >= scoreB) {

    bulb1_R();
    bulb2_R();
    bulb3_B();

    phaseStatus = "R BEST";
  }
  else if (scoreY >= scoreR && scoreY >= scoreB) {

    bulb1_B();
    bulb2_Y();
    bulb3_Y();

    phaseStatus = "Y BEST";
  }
  else {

    bulb1_B();
    bulb2_R();
    bulb3_B();

    phaseStatus = "B BEST";
  }

  // ---------------------
  // OLED Voltage Screen
  // ---------------------

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  display.setCursor(0, 0);
  display.println("PHASE VOLTAGE");

  display.setCursor(0, 20);
  display.print("R: ");
  display.print(vr, 2);
  display.println("V");

  display.setCursor(0, 35);
  display.print("Y: ");
  display.print(vy, 2);
  display.println("V");

  display.setCursor(0, 50);
  display.print("B: ");
  display.print(vb, 2);
  display.println("V");

  display.display();
  delay(3000);

  // ---------------------
  // OLED Current Screen
  // ---------------------

  display.clearDisplay();

  display.setCursor(0, 0);
  display.println("PHASE CURRENT");

  display.setCursor(0, 20);
  display.print("R: ");
  display.print(cr, 2);
  display.println("A");

  display.setCursor(0, 35);
  display.print("Y: ");
  display.print(cy, 2);
  display.println("A");

  display.setCursor(0, 50);
  display.print("B: ");
  display.print(cb, 2);
  display.println("A");

  display.display();
  delay(3000);

  // ---------------------
  // OLED Decision Screen
  // ---------------------

  display.clearDisplay();

  display.setCursor(0, 0);
  display.println("GRIDSENSE AI");

  display.setCursor(0, 25);
  display.println(phaseStatus);

  display.setCursor(0, 45);
  display.println("LOAD SHIFT ACTIVE");

  display.display();
  delay(3000);

  // ---------------------
  // Serial Monitor
  // ---------------------

  Serial.println("================================");

  Serial.print("R Voltage: ");
  Serial.println(vr, 2);

  Serial.print("Y Voltage: ");
  Serial.println(vy, 2);

  Serial.print("B Voltage: ");
  Serial.println(vb, 2);

  Serial.print("R Current: ");
  Serial.println(cr, 2);

  Serial.print("Y Current: ");
  Serial.println(cy, 2);

  Serial.print("B Current: ");
  Serial.println(cb, 2);

  Serial.print("Decision: ");
  Serial.println(phaseStatus);

  Serial.println("================================");
}