'use strict';

function validatePaymentDetails(payment, booking) {
  if (!payment || typeof payment !== 'object' || Array.isArray(payment)) {
    return { success: false, code: 'MISSING_PAYMENT_DETAILS' };
  }

  if (
    typeof payment.bookingId !== 'string' ||
    payment.bookingId.trim() === '' ||
    typeof payment.method !== 'string' ||
    payment.method.trim() === ''
  ) {
    return { success: false, code: 'MISSING_PAYMENT_DETAILS' };
  }

  if (typeof payment.amount !== 'number' || !Number.isFinite(payment.amount)) {
    return { success: false, code: 'INVALID_PAYMENT_AMOUNT' };
  }

  if (payment.amount <= 0) {
    return { success: false, code: 'INVALID_PAYMENT_AMOUNT' };
  }

  if (
    !booking ||
    typeof booking !== 'object' ||
    payment.bookingId !== booking.id ||
    payment.amount !== booking.amountDue
  ) {
    return { success: false, code: 'PAYMENT_DOES_NOT_MATCH_BOOKING' };
  }

  return { success: true };
}

function processPayment(payment, booking, providerStatus = 'success') {
  const validation = validatePaymentDetails(payment, booking);
  if (!validation.success) {
    return validation;
  }

  if (booking.status !== 'PENDING_PAYMENT') {
    return { success: false, code: 'BOOKING_NOT_PAYABLE' };
  }

  if (providerStatus !== 'success' && providerStatus !== 'failed') {
    return { success: false, code: 'INVALID_PROVIDER_STATUS' };
  }

  const status = providerStatus === 'success' ? 'PAID' : 'PAYMENT_FAILED';
  return {
    success: providerStatus === 'success',
    code: providerStatus === 'success' ? 'PAYMENT_SUCCEEDED' : 'PAYMENT_DECLINED',
    payment: {
      bookingId: booking.id,
      amount: payment.amount,
      method: payment.method.trim(),
      status,
    },
  };
}

module.exports = { validatePaymentDetails, processPayment };
