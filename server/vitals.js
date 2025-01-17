/* eslint-disable no-continue */

// Third-party dependencies
const Validator = require('express-validator')
const { DateTime } = require('luxon')
const { t } = require('i18next')

// In-house dependencies
const { helpers } = require('brave-alert-lib')
const db = require('./db/db')

let braveAlerter

// Expects JS Date objects and returns an int
function differenceInSeconds(date1, date2) {
  const dateTime1 = DateTime.fromJSDate(date1)
  const dateTime2 = DateTime.fromJSDate(date2)
  return dateTime1.diff(dateTime2, 'seconds').seconds
}

function setupVitals(braveAlerterObj) {
  braveAlerter = braveAlerterObj
}

async function sendSingleAlert(locationid, message, pgClient) {
  const location = await db.getLocationData(locationid, pgClient)

  location.client.responderPhoneNumbers.forEach(async responderPhoneNumber => {
    await braveAlerter.sendSingleAlert(responderPhoneNumber, location.client.fromPhoneNumber, message)
  })

  location.client.heartbeatPhoneNumbers.forEach(async heartbeatAlertRecipient => {
    await braveAlerter.sendSingleAlert(heartbeatAlertRecipient, location.client.fromPhoneNumber, message)
  })
}

async function sendDisconnectionMessage(locationid, displayName, language) {
  await sendSingleAlert(
    locationid,
    t('sensorDisconnectionInitial', {
      lng: language,
      deviceDisplayName: displayName,
      locationid,
    }),
  )
}

async function sendDisconnectionReminder(locationid, displayName, language) {
  await sendSingleAlert(
    locationid,
    t('sensorDisconnectionReminder', {
      lng: language,
      deviceDisplayName: displayName,
      locationid,
      language,
    }),
  )
}

async function sendReconnectionMessage(locationid, displayName, language) {
  await sendSingleAlert(
    locationid,
    t('sensorReconnection', {
      lng: language,
      deviceDisplayName: displayName,
      locationid,
    }),
  )
}

// Heartbeat Helper Functions
async function checkHeartbeat() {
  const doorThresholdSeconds = helpers.getEnvVar('DOOR_THRESHOLD_SECONDS')
  const radarThresholdSeconds = helpers.getEnvVar('RADAR_THRESHOLD_SECONDS')
  const subsequentVitalsAlertThresholdSeconds = helpers.getEnvVar('SUBSEQUENT_VITALS_ALERT_THRESHOLD')

  const currentDBTime = await db.getCurrentTime()

  const firmwareStateMachineLocations = await db.getActiveFirmwareStateMachineLocations()
  for (const location of firmwareStateMachineLocations) {
    if (!location.client.isActive || !location.isActive) {
      continue
    }

    try {
      const sensorsVital = await db.getMostRecentSensorsVitalWithLocationid(location.locationid)

      if (sensorsVital) {
        const radarDelayInSeconds = differenceInSeconds(currentDBTime, sensorsVital.createdAt)
        const doorDelayInSeconds = differenceInSeconds(currentDBTime, sensorsVital.doorLastSeenAt)

        const radarHeartbeatExceeded = radarDelayInSeconds > radarThresholdSeconds
        const doorHeartbeatExceeded = doorDelayInSeconds > doorThresholdSeconds

        if (doorHeartbeatExceeded || radarHeartbeatExceeded) {
          if (location.sentVitalsAlertAt === null) {
            if (doorHeartbeatExceeded) {
              helpers.logSentry(`Door sensor down at ${location.locationid}`)
            }
            if (radarHeartbeatExceeded) {
              helpers.logSentry(`Radar sensor down at ${location.locationid}`)
            }
            await db.updateSentAlerts(location.locationid, true)
            sendDisconnectionMessage(location.locationid, location.displayName, location.client.language)
          } else if (currentDBTime - location.sentVitalsAlertAt > subsequentVitalsAlertThresholdSeconds * 1000) {
            await db.updateSentAlerts(location.locationid, true)
            sendDisconnectionReminder(location.locationid, location.displayName, location.client.language)
          }
        } else if (location.sentVitalsAlertAt !== null) {
          helpers.logSentry(`${location.locationid} reconnected after reason: ${sensorsVital.resetReason}`)
          await db.updateSentAlerts(location.locationid, false)
          sendReconnectionMessage(location.locationid, location.displayName, location.client.language)
        }
      }
    } catch (err) {
      helpers.logError(`Error checking heartbeat: ${err.toString()}`)
    }
  }
}

function convertStateArrayToObject(stateTransition) {
  const statesTable = ['idle', 'initial_timer', 'duration_timer', 'stillness_timer']
  const reasonsTable = ['movement', 'no_movement', 'door_open', 'initial_timer', 'duration_alert', 'stillness_alert']
  const stateObject = {
    state: statesTable[stateTransition[0]],
    reason: reasonsTable[stateTransition[1]],
    time: stateTransition[2],
  }
  return stateObject
}

// Sends a low battery alert if the time since the last alert is null or greater than the timeout
async function sendLowBatteryAlert(locationid) {
  let pgClient
  try {
    const currentTime = await db.getCurrentTime()
    const timeoutInMillis = parseInt(helpers.getEnvVar('LOW_BATTERY_ALERT_TIMEOUT'), 10) * 1000

    pgClient = await db.beginTransaction()
    const location = await db.getLocationData(locationid, pgClient)

    if (
      location.isActive &&
      location.client.isActive &&
      (location.sentLowBatteryAlertAt === null || currentTime - location.sentLowBatteryAlertAt >= timeoutInMillis)
    ) {
      helpers.logSentry(`Received a low battery alert for ${location.locationid}`)
      await sendSingleAlert(
        location.locationid,
        t('sensorLowBatteryInitial', {
          lng: location.client.language,
          deviceDisplayName: location.displayName,
        }),
        pgClient,
      )
      await db.updateLowBatteryAlertTime(location.locationid, pgClient)
    }

    await db.commitTransaction(pgClient)
  } catch (e) {
    try {
      await db.rollbackTransaction(pgClient)
      helpers.logError(`handleAlert: Rolled back transaction because of error: ${e}`)
    } catch (error) {
      // Do nothing
      helpers.logError(`handleAlert: Error rolling back transaction: ${error} Rollback attempted because of error: ${e}`)
    }
  }
}

const validateHeartbeat = Validator.body(['coreid', 'data']).exists()

async function handleHeartbeat(req, res) {
  try {
    const validationErrors = Validator.validationResult(req).formatWith(helpers.formatExpressValidationErrors)

    if (validationErrors.isEmpty()) {
      const coreId = req.body.coreid
      const location = await db.getLocationFromParticleCoreID(coreId)
      if (!location) {
        const errorMessage = `Bad request to ${req.path}: no location matches the coreID ${coreId}`
        helpers.log(errorMessage)
        // Must send 200 so as not to be throttled by Particle (ref: https://docs.particle.io/reference/device-cloud/webhooks/#limits)
        res.status(200).json(errorMessage)
      } else {
        const currentDbTime = await db.getCurrentTime()

        const message = JSON.parse(req.body.data)
        const doorMissedMessagesCount = message.doorMissedMsg
        const doorLowBatteryFlag = message.doorLowBatt
        const doorTimeSinceLastHeartbeat = new Date(currentDbTime)
        doorTimeSinceLastHeartbeat.setMilliseconds(currentDbTime.getMilliseconds() - message.doorLastHeartbeat)
        const resetReason = message.resetReason
        const stateTransitionsArray = message.states.map(convertStateArrayToObject)

        if (doorLowBatteryFlag) {
          await sendLowBatteryAlert(location.locationid)
        }

        await db.logSensorsVital(
          location.locationid,
          doorMissedMessagesCount,
          doorLowBatteryFlag,
          doorTimeSinceLastHeartbeat,
          resetReason,
          stateTransitionsArray,
        )
        res.status(200).json('OK')
      }
    } else {
      const errorMessage = `Bad request to ${req.path}: ${validationErrors.array()}`
      helpers.logError(errorMessage)
      // Must send 200 so as not to be throttled by Particle (ref: https://docs.particle.io/reference/device-cloud/webhooks/#limits)
      res.status(200).json(errorMessage)
    }
  } catch (err) {
    const errorMessage = `Error calling ${req.path}: ${err.toString()}`
    helpers.logError(errorMessage)
    // Must send 200 so as not to be throttled by Particle (ref: https://docs.particle.io/reference/device-cloud/webhooks/#limits)
    res.status(200).json(errorMessage)
  }
}

module.exports = {
  checkHeartbeat,
  handleHeartbeat,
  sendLowBatteryAlert,
  setupVitals,
  validateHeartbeat,
}
