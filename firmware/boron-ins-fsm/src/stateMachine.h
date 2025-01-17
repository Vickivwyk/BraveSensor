/*
 * Brave firmware state machine for single Boron
 * written by Heidi Fedorak, Apr 2021
 *
 *  State machine functions, timers, and constants are declared here
 *
*/
#ifndef STATEMACHINE_H
#define STATEMACHINE_H

//ascii table goes up to 7F, so pick something greater than that 
//which is also unlikely to be part of a door ID or a threshold/timer const
#define INITIALIZE_STATE_MACHINE_CONSTS_FLAG 0x8888

//initial (default) values for state machine, can be changed via console function
//or by writing something other than 0x8888 to the above flag in flash
#define INS_THRESHOLD 60
#define STATE1_MAX_TIME 15000 //ms = 15s
#define STATE2_MAX_DURATION 1200000 //ms = 20 min
#define STATE3_MAX_STILLNESS_TIME 120000 //ms = 2 minutes

//length of time between debug publishes
#define DEBUG_PUBLISH_INTERVAL 1500  //ms
#define SM_HEARTBEAT_INTERVAL 660000  //ms = 11 min
#define DEVICE_RESET_THRESHOLD 540000  //ms = 9 min
#define HEARTBEAT_STATES_CUTOFF 603 // = 622 - 17 (max length of sub state array) - 2 (length of closing brackets)

// Restricts heartbeat to being published once instead of 3 times from the 3 IM Door Sensor broadcasts
#define HEARTBEAT_PUBLISH_DELAY 1000  //ms = 1 sec

//setup() functions
void setupStateMachine();

//loop() functions
void initializeStateMachineConsts();
void getHeartbeat();

//state functions, called by stateHandler
void state0_idle();
void state1_15sCountdown();
void state2_duration();
void state3_stillness();

void publishDebugMessage(int, unsigned char, float, unsigned long);
void publishStateTransition(int, int, unsigned char, float);
void saveStateChange(int, int);

//threads
void heartbeatTimerThread(void *param);

// Global variables
//declaring type StateHandler that points to a function that takes
//no arguments and returns nothing
typedef void (*StateHandler)();

//declaring the state handler pointer as extern so .ino file can use it
extern StateHandler stateHandler;

//these are the timers that are zero'ed by millis()
extern unsigned long state1_timer;
extern unsigned long state2_duration_timer;
extern unsigned long state3_stillness_timer;

//state machine constants stored in flash
extern unsigned long ins_threshold;
extern unsigned long state1_max_time;
extern unsigned long state2_max_duration;
extern unsigned long state3_max_stillness_time;

//flag to turn debugging on and off
extern bool stateMachineDebugFlag;

#endif