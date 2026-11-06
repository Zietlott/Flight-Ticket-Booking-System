'use strict';

const PASSPORT_PATTERN = /^[A-Z0-9]{6,12}$/i;

function validatePassenger(passenger) {
  if (!passenger || typeof passenger !== 'object' || Array.isArray(passenger)) {
    return { success: false, code: 'INVALID_PASSENGER' };
  }

  const { fullName, passportNumber } = passenger;
  if (typeof fullName !== 'string' || fullName.trim() === '') {
    return { success: false, code: 'MISSING_PASSENGER_NAME' };
  }

  if (typeof passportNumber !== 'string' || passportNumber.trim() === '') {
    return { success: false, code: 'MISSING_PASSPORT_NUMBER' };
  }

  const normalizedPassport = passportNumber.trim().toUpperCase();
  if (!PASSPORT_PATTERN.test(normalizedPassport)) {
    return { success: false, code: 'INVALID_PASSPORT_NUMBER' };
  }

  return {
    success: true,
    passenger: {
      fullName: fullName.trim(),
      passportNumber: normalizedPassport,
    },
  };
}

function createBooking(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { success: false, code: 'INVALID_BOOKING' };
  }

  const { flight, passengers } = input;
  if (!flight || typeof flight !== 'object' || typeof flight.id !== 'string' || flight.id.trim() === '') {
    return { success: false, code: 'INVALID_FLIGHT' };
  }

  if (!Number.isFinite(flight.price) || flight.price <= 0) {
    return { success: false, code: 'INVALID_FLIGHT_PRICE' };
  }

  if (!Number.isInteger(flight.seatsAvailable) || flight.seatsAvailable < 0) {
    return { success: false, code: 'INVALID_SEAT_COUNT' };
  }

  if (!Array.isArray(passengers) || passengers.length === 0) {
    return { success: false, code: 'MISSING_PASSENGERS' };
  }

  const validatedPassengers = [];
  for (const passenger of passengers) {
    const result = validatePassenger(passenger);
    if (!result.success) {
      return result;
    }
    validatedPassengers.push(result.passenger);
  }

  if (passengers.length > flight.seatsAvailable) {
    return { success: false, code: 'INSUFFICIENT_SEATS' };
  }

  const amountDue = Math.round(flight.price * passengers.length * 100) / 100;
  return {
    success: true,
    booking: {
      flightId: flight.id,
      passengers: validatedPassengers,
      passengerCount: validatedPassengers.length,
      amountDue,
      status: 'PENDING_PAYMENT',
    },
  };
}

module.exports = { validatePassenger, createBooking };
