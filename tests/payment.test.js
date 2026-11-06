const { processPayment, validatePaymentDetails } = require('../services/paymentService');

const booking = { id: 'BK-100', amountDue: 1250000, status: 'PENDING_PAYMENT' };
const payment = { bookingId: 'BK-100', amount: 1250000, method: 'card' };

describe('Payment service', () => {
  test('PAY01 - accepts a valid payment amount', () => {
    expect(validatePaymentDetails(payment, booking)).toEqual({ success: true });
  });

  test('PAY02 - rejects a zero amount', () => {
    expect(validatePaymentDetails({ ...payment, amount: 0 }, booking)).toEqual({
      success: false,
      code: 'INVALID_PAYMENT_AMOUNT',
    });
  });

  test('PAY03 - rejects a negative amount', () => {
    expect(validatePaymentDetails({ ...payment, amount: -1 }, booking)).toEqual({
      success: false,
      code: 'INVALID_PAYMENT_AMOUNT',
    });
  });

  test('PAY04 - rejects an amount with the wrong data type', () => {
    expect(validatePaymentDetails({ ...payment, amount: '1250000' }, booking)).toEqual({
      success: false,
      code: 'INVALID_PAYMENT_AMOUNT',
    });
  });

  test('PAY05 - rejects NaN', () => {
    expect(validatePaymentDetails({ ...payment, amount: NaN }, booking)).toEqual({
      success: false,
      code: 'INVALID_PAYMENT_AMOUNT',
    });
  });

  test('PAY06 - rejects Infinity', () => {
    expect(validatePaymentDetails({ ...payment, amount: Infinity }, booking)).toEqual({
      success: false,
      code: 'INVALID_PAYMENT_AMOUNT',
    });
  });

  test('PAY07 - rejects missing payment details', () => {
    expect(validatePaymentDetails(null, booking)).toEqual({
      success: false,
      code: 'MISSING_PAYMENT_DETAILS',
    });
  });

  test('PAY08 - marks a successful provider result as paid', () => {
    expect(processPayment(payment, booking)).toEqual({
      success: true,
      code: 'PAYMENT_SUCCEEDED',
      payment: {
        bookingId: 'BK-100',
        amount: 1250000,
        method: 'card',
        status: 'PAID',
      },
    });
  });

  test('PAY09 - rejects an amount that does not match the booking', () => {
    expect(validatePaymentDetails({ ...payment, amount: 1 }, booking)).toEqual({
      success: false,
      code: 'PAYMENT_DOES_NOT_MATCH_BOOKING',
    });
  });

  test('PAY10 - rejects a payment for another booking', () => {
    expect(validatePaymentDetails({ ...payment, bookingId: 'BK-OTHER' }, booking)).toEqual({
      success: false,
      code: 'PAYMENT_DOES_NOT_MATCH_BOOKING',
    });
  });

  test('PAY11 - records a declined payment without marking it paid', () => {
    expect(processPayment(payment, booking, 'failed')).toMatchObject({
      success: false,
      code: 'PAYMENT_DECLINED',
      payment: { status: 'PAYMENT_FAILED' },
    });
  });

  test('PAY12 - rejects payment for a booking that is not pending', () => {
    expect(processPayment(payment, { ...booking, status: 'PAID' })).toEqual({
      success: false,
      code: 'BOOKING_NOT_PAYABLE',
    });
  });

  test('PAY13 - rejects an unknown provider result', () => {
    expect(processPayment(payment, booking, 'unknown')).toEqual({
      success: false,
      code: 'INVALID_PROVIDER_STATUS',
    });
  });
});
