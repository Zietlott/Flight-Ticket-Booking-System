const { createBooking, validatePassenger } = require('../services/bookingService');

const flight = { id: 'VN101', price: 1250000, seatsAvailable: 2 };
const passenger = { fullName: '  Nguyen Van An ', passportNumber: ' ab123456 ' };

describe('Booking and Passenger service', () => {
  test('BK01 - creates a booking for a valid passenger', () => {
    const result = createBooking({ flight, passengers: [passenger] });
    expect(result.success).toBe(true);
    expect(result.booking).toMatchObject({
      flightId: 'VN101',
      passengerCount: 1,
      amountDue: 1250000,
      status: 'PENDING_PAYMENT',
    });
  });

  test('BK02 - rejects a missing passenger name', () => {
    expect(validatePassenger({ passportNumber: 'AB123456' })).toEqual({
      success: false,
      code: 'MISSING_PASSENGER_NAME',
    });
  });

  test('BK03 - rejects a missing passport number', () => {
    expect(validatePassenger({ fullName: 'Nguyen Van An' })).toEqual({
      success: false,
      code: 'MISSING_PASSPORT_NUMBER',
    });
  });

  test('BK04 - rejects a malformed passport number', () => {
    expect(validatePassenger({ fullName: 'Nguyen Van An', passportNumber: '12-34' })).toEqual({
      success: false,
      code: 'INVALID_PASSPORT_NUMBER',
    });
  });

  test('BK05 - rejects a booking when the flight has no seats', () => {
    expect(createBooking({ flight: { ...flight, seatsAvailable: 0 }, passengers: [passenger] })).toEqual({
      success: false,
      code: 'INSUFFICIENT_SEATS',
    });
  });

  test('BK06 - rejects a non-positive passenger count', () => {
    expect(createBooking({ flight, passengers: [] })).toEqual({
      success: false,
      code: 'MISSING_PASSENGERS',
    });
  });

  test('BK07 - normalizes valid passenger details', () => {
    expect(validatePassenger(passenger)).toEqual({
      success: true,
      passenger: { fullName: 'Nguyen Van An', passportNumber: 'AB123456' },
    });
  });

  test('BK08 - allows booking the last available seat', () => {
    const result = createBooking({
      flight: { ...flight, seatsAvailable: 1 },
      passengers: [passenger],
    });
    expect(result.success).toBe(true);
    expect(result.booking.passengerCount).toBe(1);
  });

  test('BK09 - rejects more passengers than available seats', () => {
    expect(
      createBooking({ flight, passengers: [passenger, passenger, passenger] }),
    ).toEqual({ success: false, code: 'INSUFFICIENT_SEATS' });
  });

  test('BK10 - calculates the total for multiple passengers', () => {
    const result = createBooking({ flight, passengers: [passenger, passenger] });
    expect(result.booking.amountDue).toBe(2500000);
    expect(result.booking.passengerCount).toBe(2);
  });

  test('BK11 - rejects an invalid flight price', () => {
    expect(createBooking({ flight: { ...flight, price: Infinity }, passengers: [passenger] })).toEqual({
      success: false,
      code: 'INVALID_FLIGHT_PRICE',
    });
  });

  test('BK12 - rejects a passenger with the wrong data type', () => {
    expect(createBooking({ flight, passengers: ['Nguyen Van An'] })).toEqual({
      success: false,
      code: 'INVALID_PASSENGER',
    });
  });
});
