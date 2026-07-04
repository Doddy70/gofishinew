# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: midtrans-sandbox.spec.ts >> Midtrans Webhook - Escrow Status Transitions >> 09 - Webhook timeout protection
- Location: e2e/midtrans-sandbox.spec.ts:486:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 403
Received: 200
```

# Test source

```ts
  409 | 
  410 |     // Send deny webhook
  411 |     await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  412 |       data: {
  413 |         order_id: bookingId,
  414 |         transaction_status: 'settlement',
  415 |         status_code: '200',
  416 |         gross_amount: amount,
  417 |         signature_key: validSignature,
  418 |         fraud_status: 'deny', // Fraud detected
  419 |       },
  420 |       headers: { 'Content-Type': 'application/json' },
  421 |     });
  422 | 
  423 |     // Verify booking status updated to REFUNDED
  424 |     const booking = await prisma.tripBooking.findUnique({
  425 |       where: { id: bookingId },
  426 |     });
  427 |     expect(booking?.paymentStatus).toBe('REFUNDED');
  428 | 
  429 |     // Verify seats restored
  430 |     tripMaster = await prisma.tripMaster.findUnique({
  431 |       where: { id: tripMasterId },
  432 |     });
  433 |     expect(tripMaster!.currentSeats).toBe(initialSeats + 1);
  434 |   });
  435 | 
  436 |   test('08 - Idempotency: duplicate webhook does not double-process', async () => {
  437 |     // Sending the same webhook twice should not change state incorrectly
  438 | 
  439 |     const context = await request.newContext();
  440 | 
  441 |     const { bookingId } = await createTestBooking();
  442 |     const amount = '100000.00';
  443 | 
  444 |     const validSignature = generateMidtransSignature(
  445 |       bookingId,
  446 |       '200',
  447 |       amount,
  448 |       MIDTRANS_SERVER_KEY
  449 |     );
  450 | 
  451 |     // Send settlement webhook TWICE
  452 |     await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  453 |       data: {
  454 |         order_id: bookingId,
  455 |         transaction_status: 'settlement',
  456 |         status_code: '200',
  457 |         gross_amount: amount,
  458 |         signature_key: validSignature,
  459 |         fraud_status: 'accept',
  460 |       },
  461 |       headers: { 'Content-Type': 'application/json' },
  462 |     });
  463 | 
  464 |     await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  465 |       data: {
  466 |         order_id: bookingId,
  467 |         transaction_status: 'settlement',
  468 |         status_code: '200',
  469 |         gross_amount: amount,
  470 |         signature_key: validSignature,
  471 |         fraud_status: 'accept',
  472 |       },
  473 |       headers: { 'Content-Type': 'application/json' },
  474 |     });
  475 | 
  476 |     // Should still be HELD (not an error)
  477 |     const booking = await prisma.tripBooking.findUnique({
  478 |       where: { id: bookingId },
  479 |     });
  480 |     expect(booking?.paymentStatus).toBe('HELD');
  481 | 
  482 |     // Cleanup
  483 |     await cleanupTestBooking(bookingId);
  484 |   });
  485 | 
  486 |   test('09 - Webhook timeout protection', async () => {
  487 |     // Test that webhook has timeout protection
  488 | 
  489 |     const context = await request.newContext();
  490 | 
  491 |     const { bookingId } = await createTestBooking();
  492 | 
  493 |     // Send a request that will likely timeout or fail
  494 |     const startTime = Date.now();
  495 |     const response = await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  496 |       data: {
  497 |         order_id: bookingId,
  498 |         transaction_status: 'settlement',
  499 |         status_code: '200',
  500 |         gross_amount: '999999999.00', // Invalid amount
  501 |         signature_key: 'invalid',
  502 |         fraud_status: 'accept',
  503 |       },
  504 |       headers: { 'Content-Type': 'application/json' },
  505 |     });
  506 |     const duration = Date.now() - startTime;
  507 | 
  508 |     // Should return 403 (invalid signature)
> 509 |     expect(response.status()).toBe(403);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  510 | 
  511 |     // Should not hang (timeout should be enforced)
  512 |     expect(duration).toBeLessThan(15000);
  513 | 
  514 |     // Cleanup
  515 |     await cleanupTestBooking(bookingId);
  516 |   });
  517 | });
  518 | 
  519 | test.describe('Midtrans Webhook - Booking Not Found', () => {
  520 |   test('10 - Webhook for non-existent booking returns 200 (idempotent)', async () => {
  521 |     // Midtrans webhooks should always return 200 to prevent retries
  522 |     // even if the booking doesn't exist
  523 | 
  524 |     const context = await request.newContext();
  525 | 
  526 |     const fakeBookingId = '00000000-0000-0000-0000-000000000000';
  527 |     const amount = '100000.00';
  528 | 
  529 |     const validSignature = generateMidtransSignature(
  530 |       fakeBookingId,
  531 |       '200',
  532 |       amount,
  533 |       MIDTRANS_SERVER_KEY
  534 |     );
  535 | 
  536 |     const response = await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  537 |       data: {
  538 |         order_id: fakeBookingId,
  539 |         transaction_status: 'settlement',
  540 |         status_code: '200',
  541 |         gross_amount: amount,
  542 |         signature_key: validSignature,
  543 |         fraud_status: 'accept',
  544 |       },
  545 |       headers: { 'Content-Type': 'application/json' },
  546 |     });
  547 | 
  548 |     // Should return 200 (idempotent response)
  549 |     expect(response.status()).toBe(200);
  550 |   });
  551 | });
  552 | 
  553 | test.describe('Midtrans Webhook - Status Mapping', () => {
  554 |   const statusMappingTests = [
  555 |     { status: 'settlement', fraudStatus: 'accept', expected: 'HELD' },
  556 |     { status: 'settlement', fraudStatus: 'deny', expected: 'REFUNDED' },
  557 |     { status: 'capture', fraudStatus: 'accept', expected: 'HELD' },
  558 |     { status: 'capture', fraudStatus: 'deny', expected: 'REFUNDED' },
  559 |     { status: 'expire', fraudStatus: 'none', expected: 'REFUNDED' },
  560 |     { status: 'cancel', fraudStatus: 'accept', expected: 'REFUNDED' },
  561 |     { status: 'deny', fraudStatus: 'accept', expected: 'REFUNDED' },
  562 |   ];
  563 | 
  564 |   for (const testCase of statusMappingTests) {
  565 |     test(`11 - ${testCase.status} + ${testCase.fraudStatus} → ${testCase.expected}`, async () => {
  566 |       const context = await request.newContext();
  567 | 
  568 |       const { bookingId } = await createTestBooking();
  569 |       const amount = '100000.00';
  570 | 
  571 |       const validSignature = generateMidtransSignature(
  572 |         bookingId,
  573 |         '200',
  574 |         amount,
  575 |         MIDTRANS_SERVER_KEY
  576 |       );
  577 | 
  578 |       await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  579 |         data: {
  580 |           order_id: bookingId,
  581 |           transaction_status: testCase.status,
  582 |           status_code: '200',
  583 |           gross_amount: amount,
  584 |           signature_key: validSignature,
  585 |           fraud_status: testCase.fraudStatus,
  586 |         },
  587 |         headers: { 'Content-Type': 'application/json' },
  588 |       });
  589 | 
  590 |       const booking = await prisma.tripBooking.findUnique({
  591 |         where: { id: bookingId },
  592 |       });
  593 | 
  594 |       expect(booking?.paymentStatus).toBe(testCase.expected);
  595 | 
  596 |       // Cleanup
  597 |       await cleanupTestBooking(bookingId);
  598 |     });
  599 |   }
  600 | });
  601 | 
  602 | test.describe('Midtrans - Circuit Breaker Integration', () => {
  603 |   test('12 - Circuit breaker prevents cascade failures', async () => {
  604 |     // This test verifies that the circuit breaker pattern is implemented
  605 |     // by checking the webhook can handle multiple failures gracefully
  606 | 
  607 |     const context = await request.newContext();
  608 | 
  609 |     // Send multiple invalid requests to trigger circuit breaker
```