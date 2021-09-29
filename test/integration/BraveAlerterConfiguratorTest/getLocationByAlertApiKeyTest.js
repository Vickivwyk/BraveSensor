// Third-party dependencies
const { expect } = require('chai')
const { afterEach, beforeEach, describe, it } = require('mocha')

// In-house dependencies
const { Location, SYSTEM } = require('brave-alert-lib')
const BraveAlerterConfigurator = require('../../../BraveAlerterConfigurator')
const db = require('../../../db/db')
const { clientFactory } = require('../../../testingHelpers')

describe('BraveAlerterConfigurator.js integration tests: getLocationByAlertApiKey', () => {
  beforeEach(async () => {
    await db.clearTables()

    this.expectedLocationId = 'TEST LOCATION'
    this.apiKey = 'myApiKey'

    // Insert a location in the DB
    this.client = await clientFactory(db, { alertApiKey: this.apiKey })
    await db.createLocation(
      this.expectedLocationId,
      1,
      1,
      1,
      1,
      1,
      [],
      '+3336661234',
      [],
      1,
      'displayName',
      'DoorCoreId',
      'RadarCoreId',
      'XeThru',
      true,
      false,
      null,
      '2021-03-09T19:37:28.176Z',
      this.client.id,
    )
  })

  afterEach(async () => {
    await db.clearTables()
  })

  it('given a API key that matches a single client with a single location should return a BraveAlertLib Location object with the values from that location', async () => {
    const expectedLocation = new Location(this.expectedLocationId, SYSTEM.SENSOR)

    const braveAlerterConfigurator = new BraveAlerterConfigurator()
    const actualLocation = await braveAlerterConfigurator.getLocationByAlertApiKey(this.apiKey)

    expect(actualLocation).to.eql(expectedLocation)
  })

  it('given a API key that does not match any clients should return null', async () => {
    const braveAlerterConfigurator = new BraveAlerterConfigurator()
    const actualLocation = await braveAlerterConfigurator.getLocationByAlertApiKey('notARealApiKey')

    expect(actualLocation).to.be.null
  })

  it('given an API key that matches a single client that has no locations should return null', async () => {
    await db.clearLocations()

    const braveAlerterConfigurator = new BraveAlerterConfigurator()
    const actualLocation = await braveAlerterConfigurator.getLocationByAlertApiKey(this.apiKey)

    expect(actualLocation).to.be.null
  })

  describe('given a API key that matches more than one client and each client has a single location', () => {
    beforeEach(async () => {
      this.anotherExpectedLocationId = 'TEST LOCATION 2'
      // Insert another client and location in the DB
      const newClient = await clientFactory(db, { displayName: 'TEST CLIENT 2', alertApiKey: this.apiKey })
      await db.createLocation(
        this.anotherExpectedLocationId,
        1,
        1,
        1,
        1,
        1,
        [],
        '+3336661234',
        [],
        1,
        'displayName',
        'DoorCoreId',
        'RadarCoreId',
        'XeThru',
        true,
        false,
        null,
        '2021-03-09T19:37:28.176Z',
        newClient.id,
      )
    })

    it('should return a BraveAlertLib Location object with the one of the displaynames', async () => {
      const braveAlerterConfigurator = new BraveAlerterConfigurator()
      const actualLocation = await braveAlerterConfigurator.getLocationByAlertApiKey(this.apiKey)
      expect(actualLocation.name).to.be.oneOf([this.expectedLocationId, this.anotherExpectedLocationId])
    })

    it('should return a BraveAlertLib Location object with the Sensors system', async () => {
      const braveAlerterConfigurator = new BraveAlerterConfigurator()
      const actualLocation = await braveAlerterConfigurator.getLocationByAlertApiKey('myApiKey')
      expect(actualLocation.system).to.equal(SYSTEM.SENSOR)
    })
  })
})
