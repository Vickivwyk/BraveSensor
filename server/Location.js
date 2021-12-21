class Location {
  // prettier-ignore
  constructor(locationid, displayName, movementThreshold, durationTimer, stillnessTimer, sentVitalsAlertAt, heartbeatAlertRecipients, doorCoreId, radarCoreId, radarType, reminderTimer, fallbackTimer, twilioNumber, fallbackNumbers, initialTimer, isActive, firmwareStateMachine, sirenParticleId, sentLowBatteryAlertAt, client) {
    this.locationid = locationid
    this.displayName = displayName
    this.movementThreshold = movementThreshold
    this.durationTimer = durationTimer
    this.stillnessTimer = stillnessTimer
    this.sentVitalsAlertAt = sentVitalsAlertAt
    this.heartbeatAlertRecipients = heartbeatAlertRecipients
    this.doorCoreId = doorCoreId
    this.radarCoreId = radarCoreId
    this.radarType = radarType
    this.reminderTimer = reminderTimer
    this.fallbackTimer = fallbackTimer
    this.twilioNumber = twilioNumber
    this.fallbackNumbers = fallbackNumbers
    this.initialTimer = initialTimer
    this.isActive = isActive
    this.firmwareStateMachine = firmwareStateMachine
    this.client = client
    this.sirenParticleId = sirenParticleId
    this.sentLowBatteryAlertAt = sentLowBatteryAlertAt
  }
}

module.exports = Location