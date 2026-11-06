const { createBooking } = require('../services/bookingService');
const { processPayment } = require('../services/paymentService');
const { issueTickets } = require('../services/ticketService');

const flight = { id: 'VN101', price: 1250000, seatsAvailable: 1 };
const passenger = { fullName: 'Nguyen Van An', passportNumber: 'AB123456' };

describe('Booking, payment, and ticket lifecycle', () => {
  test('creates a booking, marks it paid, then issues its ticket', () => {
    const bookingResult = createBooking({ flight, passengers: [passenger] });
    expect(bookingResult.success).toBe(true);

    const booking = { id: 'BK-200', ...bookingResult.booking };
    const paymentResult = processPayment(
      { bookingId: booking.id, amount: booking.amountDue, method: 'card' },
      booking,
    );
    expect(paymentResult.success).toBe(true);

    const ticketResult = issueTickets({ ...booking, status: paymentResult.payment.status });
    expect(ticketResult.success).toBe(true);
    expect(ticketResult.tickets).toHaveLength(1);
    expect(ticketResult.tickets[0]).toMatchObject({
      bookingId: 'BK-200',
      flightId: 'VN101',
      passenger,
      status: 'ISSUED',
    });
  });

  test('does not issue a ticket when payment is declined', () => {
    const bookingResult = createBooking({ flight, passengers: [passenger] });
    const booking = { id: 'BK-201', ...bookingResult.booking };
    const paymentResult = processPayment(
      { bookingId: booking.id, amount: booking.amountDue, method: 'card' },
      booking,
      'failed',
    );

    expect(paymentResult.success).toBe(false);
    expect(issueTickets({ ...booking, status: paymentResult.payment.status })).toEqual({
      success: false,
      code: 'BOOKING_NOT_PAID',
    });
  });
});
