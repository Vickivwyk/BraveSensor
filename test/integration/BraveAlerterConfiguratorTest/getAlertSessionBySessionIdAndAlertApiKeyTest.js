// Third-party dependencies
const { expect } = require('chai')
const { afterEach, beforeEach, describe, it } = require('mocha')

// In-house dependencies
const { CHATBOT_STATE, ALERT_TYPE, AlertSession } = require('brave-alert-lib')
const BraveAlerterConfigurator = require('../../../BraveAlerterConfigurator')
const db = require('../../../db/db')
const { clientFactory } = require('../../../testingHelpers')

describe('BraveAlerterConfigurator.js integration tests: getAlertSessionBySessionIdAndAlertApiKey', () => {
  beforeEach(async () => {
    await db.clearTables()

    this.expectedChatbotState = CHATBOT_STATE.WAITING_FOR_CATEGORY
    this.expectedIncidentType = 'No One Inside'
    this.expectedLocationDisplayName = 'TEST LOCATION'
    this.expectedLocationPhoneNumber = '+17772225555'
    this.expectedTwilioPhoneNumber = '+3336661234'
    this.alertApiKey = 'myAlertApiKey'

    // Insert a location in the DB
    const client = await clientFactory(db, { responderPhoneNumber: this.expectedLocationPhoneNumber, alertApiKey: this.alertApiKey })
    await db.createLocation(
      'LocationId',
      1,
      1,
      1,
      1,
      1,
      [],
      this.expectedTwilioPhoneNumber,
      [],
      1,
      this.expectedLocationDisplayName,
      'DoorCoreId',
      'RadarCoreId',
      'XeThru',
      true,
      false,
      null,
      '2021-03-09T19:37:28.176Z',
      client.id,
    )
    const locationId = (await db.getLocations())[0].locationid

    // Insert a session for that location in the DB
    this.session = await db.createSession(locationId, this.expectedLocationPhoneNumber, ALERT_TYPE.SENSOR_DURATION)
    this.session.chatbotState = this.expectedChatbotState
    this.session.incidentType = this.expectedIncidentType
    await db.saveSession(this.session)
  })

  afterEach(async () => {
    await db.clearTables()
  })

  it('should create a new AlertSession with expected values from the sessions and locations DB tables', async () => {
    const braveAlerterConfigurator = new BraveAlerterConfigurator()
    const actualAlertSession = await braveAlerterConfigurator.getAlertSessionBySessionIdAndAlertApiKey(this.session.id, this.alertApiKey)

    const expectedAlertSession = new AlertSession(
      this.session.id,
      this.expectedChatbotState,
      this.expectedIncidentType,
      undefined,
      `An alert to check on the washroom at ${this.expectedLocationDisplayName} was not responded to. Please check on it`,
      this.expectedLocationPhoneNumber,
      ['1', '2', '3', '4'],
      ['No One Inside', 'Person responded', 'Overdose', 'None of the above'],
    )

    expect(actualAlertSession).to.eql(expectedAlertSession)
  })
})
