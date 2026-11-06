const { searchFlights, validateSearchCriteria } = require('../services/flightSearchService');

const criteria = { origin: 'HAN', destination: 'SGN', departureDate: '2026-12-01' };
const flights = [
  { id: 'VN101', origin: 'HAN', destination: 'SGN', departureDate: '2026-12-01', seatsAvailable: 4 },
  { id: 'VN102', origin: 'HAN', destination: 'SGN', departureDate: '2026-12-01', seatsAvailable: 2 },
  { id: 'VN103', origin: 'SGN', destination: 'HAN', departureDate: '2026-12-01', seatsAvailable: 3 },
  { id: 'VN104', origin: 'HAN', destination: 'SGN', departureDate: '2026-12-02', seatsAvailable: 3 },
  { id: 'VN105', origin: 'HAN', destination: 'SGN', departureDate: '2026-12-01', seatsAvailable: 0 },
];

describe('Flight Search service', () => {
  test('FS01 - finds flights matching valid search criteria', () => {
    expect(searchFlights(flights, criteria).flights.map((flight) => flight.id)).toEqual([
      'VN101',
      'VN102',
    ]);
  });

  test('FS02 - rejects a missing origin', () => {
    expect(validateSearchCriteria({ ...criteria, origin: ' ' })).toEqual({
      success: false,
      code: 'MISSING_AIRPORT',
    });
  });

  test('FS03 - rejects a missing destination', () => {
    expect(validateSearchCriteria({ ...criteria, destination: '' })).toEqual({
      success: false,
      code: 'MISSING_AIRPORT',
    });
  });

  test('FS04 - rejects identical origin and destination', () => {
    expect(validateSearchCriteria({ ...criteria, destination: ' han ' })).toEqual({
      success: false,
      code: 'SAME_AIRPORT',
    });
  });

  test('FS05 - rejects a missing departure date', () => {
    expect(validateSearchCriteria({ ...criteria, departureDate: '' })).toEqual({
      success: false,
      code: 'INVALID_DEPARTURE_DATE',
    });
  });

  test('FS06 - rejects an impossible calendar date', () => {
    expect(validateSearchCriteria({ ...criteria, departureDate: '2026-02-30' })).toEqual({
      success: false,
      code: 'INVALID_DEPARTURE_DATE',
    });
  });

  test('FS07 - returns an empty list when there are no matching flights', () => {
    expect(searchFlights(flights, { ...criteria, departureDate: '2026-12-03' })).toEqual({
      success: true,
      flights: [],
    });
  });

  test('FS08 - returns all matching flights and excludes sold-out flights', () => {
    const result = searchFlights(flights, criteria);
    expect(result.flights).toHaveLength(2);
    expect(result.flights.every((flight) => flight.seatsAvailable > 0)).toBe(true);
  });

  test('FS09 - rejects a non-object search request', () => {
    expect(searchFlights(flights, null)).toEqual({
      success: false,
      code: 'INVALID_SEARCH_CRITERIA',
    });
  });

  test('FS10 - rejects a non-array flight list', () => {
    expect(searchFlights(null, criteria)).toEqual({
      success: false,
      code: 'INVALID_FLIGHT_LIST',
    });
  });
});
