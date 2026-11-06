'use strict';

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validateSearchCriteria(criteria) {
  if (!criteria || typeof criteria !== 'object' || Array.isArray(criteria)) {
    return { success: false, code: 'INVALID_SEARCH_CRITERIA' };
  }

  const { origin, destination, departureDate } = criteria;
  if (
    typeof origin !== 'string' ||
    origin.trim() === '' ||
    typeof destination !== 'string' ||
    destination.trim() === ''
  ) {
    return { success: false, code: 'MISSING_AIRPORT' };
  }

  if (origin.trim().toUpperCase() === destination.trim().toUpperCase()) {
    return { success: false, code: 'SAME_AIRPORT' };
  }

  if (!isValidDate(departureDate)) {
    return { success: false, code: 'INVALID_DEPARTURE_DATE' };
  }

  return { success: true };
}

function searchFlights(flights, criteria) {
  const validation = validateSearchCriteria(criteria);
  if (!validation.success) {
    return validation;
  }

  if (!Array.isArray(flights)) {
    return { success: false, code: 'INVALID_FLIGHT_LIST' };
  }

  const origin = criteria.origin.trim().toUpperCase();
  const destination = criteria.destination.trim().toUpperCase();
  const results = flights.filter(
    (flight) =>
      flight &&
      typeof flight.origin === 'string' &&
      typeof flight.destination === 'string' &&
      flight.origin.trim().toUpperCase() === origin &&
      flight.destination.trim().toUpperCase() === destination &&
      flight.departureDate === criteria.departureDate &&
      Number.isInteger(flight.seatsAvailable) &&
      flight.seatsAvailable > 0,
  );

  return { success: true, flights: results };
}

module.exports = { isValidDate, validateSearchCriteria, searchFlights };
