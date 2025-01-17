/*
 * Brave firmware state machine for single Boron
 * written by Heidi Fedorak, Apr 2021
*/

#include "Particle.h"
#include "im21door.h"
#include "ins3331.h"
#include "stateMachine.h"
#include "consoleFunctions.h"
#include "wifi.h"
#include "tpl5010watchdog.h"

#define DEBUG_LEVEL LOG_LEVEL_INFO
#define BRAVE_FIRMWARE_VERSION 60400 //see versioning notes in the readme
#define BRAVE_PRODUCT_ID 12858 //12858 = beta units, 12876 = production units

PRODUCT_ID(BRAVE_PRODUCT_ID); //you get this number off the particle console, see readme for instructions
PRODUCT_VERSION(BRAVE_FIRMWARE_VERSION); //must be an int, see versioning notes above
SYSTEM_MODE(SEMI_AUTOMATIC);
SYSTEM_THREAD(ENABLED);
SerialLogHandler logHandler(WARN_LEVEL);

void setup() {
  // enable reset reason
  System.enableFeature(FEATURE_RESET_INFO);

  // use external antenna on Boron
  BLE.selectAntenna(BleAntennaType::EXTERNAL);
  setupIM21();
  setupINS3331();
  setupConsoleFunctions();
  setupStateMachine();
  setupWifi();
  setupWatchdog();
  



  Particle.publishVitals(120);  //two minutes
  
}

void loop() {

    checkWifi();

  // service the watchdog if Particle is connected to wifi
  if(WiFi.ready()){
    serviceWatchdog();
  }
  //officially sanctioned Mariano (at Particle support) code
  //aka don't send commands to peripherals via UART in setup() because
  //particleOS may not have finished initializing its UART modules
  static bool initialized = false;

  //do once
  if(!initialized && Particle.connected()){ 
    // use external antenna on Boron
    //BLE.selectAntenna(BleAntennaType::EXTERNAL);  
    initializeStateMachineConsts();
    initializeDoorID();
    startINSSerial();
    initialized = true; 
  }

  //do every time loop() is called
  if (initialized) {
    stateHandler();
    getHeartbeat();
  }


}

