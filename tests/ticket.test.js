const { issueTickets } = require('../services/ticketService');

const paidBooking = {
  id: 'BK-100',
  flightId: 'VN101',
  status: 'PAID',
  passengers: [
    { fullName: 'Nguyen Van An', passportNumber: 'AB123456' },
    { fullName: 'Tran Thi Binh', passportNumber: 'CD123456' },
  ],
};

describe('Ticket service', () => {
  test('TK01 - issues one ticket for each passenger on a paid booking', () => {
    const result = issueTickets(paidBooking);
    expect(result.success).toBe(true);
    expect(result.tickets).toHaveLength(2);
    expect(result.tickets.map((ticket) => ticket.ticketId)).toEqual(['BK-100-1', 'BK-100-2']);
    expect(result.tickets.every((ticket) => ticket.status === 'ISSUED')).toBe(true);
  });

  test('TK02 - does not issue tickets for a pending booking', () => {
    expect(issueTickets({ ...paidBooking, status: 'PENDING_PAYMENT' })).toEqual({
      success: false,
      code: 'BOOKING_NOT_PAID',
    });
  });

  test('TK03 - does not issue tickets for a failed payment', () => {
    expect(issueTickets({ ...paidBooking, status: 'PAYMENT_FAILED' })).toEqual({
      success: false,
      code: 'BOOKING_NOT_PAID',
    });
  });

  test('TK04 - prevents issuing a duplicate ticket for a booking', () => {
    expect(issueTickets(paidBooking, [{ bookingId: 'BK-100' }])).toEqual({
      success: false,
      code: 'TICKET_ALREADY_ISSUED',
    });
  });

  test('TK05 - rejects a paid booking without passenger information', () => {
    expect(issueTickets({ ...paidBooking, passengers: [] })).toEqual({
      success: false,
      code: 'INVALID_BOOKING',
    });
  });

  test('TK06 - rejects an invalid existing-ticket list', () => {
    expect(issueTickets(paidBooking, null)).toEqual({
      success: false,
      code: 'INVALID_TICKET_LIST',
    });
  });

  test('TK07 - rejects malformed passenger information', () => {
    expect(issueTickets({ ...paidBooking, passengers: [{}] })).toEqual({
      success: false,
      code: 'INVALID_PASSENGER',
    });
  });

  test('TK08 - rejects a passenger with an invalid passport number', () => {
    expect(
      issueTickets({
        ...paidBooking,
        passengers: [{ fullName: 'Nguyen Van An', passportNumber: '12-34' }],
      }),
    ).toEqual({ success: false, code: 'INVALID_PASSENGER' });
  });
});
