'use strict';

const { validatePassenger } = require('./bookingService');

function issueTickets(booking, existingTickets = []) {
  if (!booking || typeof booking !== 'object' || booking.status !== 'PAID') {
    return { success: false, code: 'BOOKING_NOT_PAID' };
  }

  if (
    typeof booking.id !== 'string' ||
    booking.id.trim() === '' ||
    typeof booking.flightId !== 'string' ||
    booking.flightId.trim() === '' ||
    !Array.isArray(booking.passengers) ||
    booking.passengers.length === 0
  ) {
    return { success: false, code: 'INVALID_BOOKING' };
  }

  const passengers = [];
  for (const passenger of booking.passengers) {
    const result = validatePassenger(passenger);
    if (!result.success) {
      return { success: false, code: 'INVALID_PASSENGER' };
    }
    passengers.push(result.passenger);
  }

  if (!Array.isArray(existingTickets)) {
    return { success: false, code: 'INVALID_TICKET_LIST' };
  }

  if (existingTickets.some((ticket) => ticket && ticket.bookingId === booking.id)) {
    return { success: false, code: 'TICKET_ALREADY_ISSUED' };
  }

  const tickets = passengers.map((passenger, index) => ({
    ticketId: `${booking.id}-${index + 1}`,
    bookingId: booking.id,
    flightId: booking.flightId,
    passenger,
    status: 'ISSUED',
  }));

  return { success: true, tickets };
}

module.exports = { issueTickets };
