# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: midtrans-sandbox.spec.ts >> Midtrans Webhook - Status Mapping >> 11 - capture + deny → REFUNDED
- Location: e2e/midtrans-sandbox.spec.ts:565:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "REFUNDED"
Received: "PENDING"
```

# Test source

```ts
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
  509 |     expect(response.status()).toBe(403);
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
> 594 |       expect(booking?.paymentStatus).toBe(testCase.expected);
      |                                      ^ Error: expect(received).toBe(expected) // Object.is equality
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
  610 |     for (let i = 0; i < 5; i++) {
  611 |       await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  612 |         data: {
  613 |           order_id: `fake-${i}`,
  614 |           transaction_status: 'settlement',
  615 |           status_code: '200',
  616 |           gross_amount: '100000.00',
  617 |           signature_key: 'invalid',
  618 |           fraud_status: 'accept',
  619 |         },
  620 |         headers: { 'Content-Type': 'application/json' },
  621 |       });
  622 |     }
  623 | 
  624 |     // After multiple failures, circuit breaker should be open
  625 |     // Next request should fail fast (not timeout)
  626 |     const startTime = Date.now();
  627 |     const response = await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  628 |       data: {
  629 |         order_id: 'test-booking',
  630 |         transaction_status: 'settlement',
  631 |         status_code: '200',
  632 |         gross_amount: '100000.00',
  633 |         signature_key: 'invalid',
  634 |         fraud_status: 'accept',
  635 |       },
  636 |       headers: { 'Content-Type': 'application/json' },
  637 |     });
  638 |     const duration = Date.now() - startTime;
  639 | 
  640 |     // Should return quickly (circuit breaker open) or still 403 (valid signature check)
  641 |     expect(response.status()).toBe(403);
  642 |     expect(duration).toBeLessThan(5000); // Should be fast, not waiting
  643 |   });
  644 | });
  645 | 
  646 | // ─── Test Suite: E2E Midtrans Escrow Flow ─────────────────────────────────────
  647 | // This test suite covers the complete payment → payout flow:
  648 | // 1. User books a trip → PENDING
  649 | // 2. Midtrans webhook (settlement) → HELD
  650 | // 3. Captain completes trip → RELEASED (payout)
  651 | 
  652 | test.describe('E2E Midtrans Escrow - Complete Flow', () => {
  653 | 
  654 |   test('13 - Full escrow flow: PENDING → HELD → RELEASED', async () => {
  655 |     // This is the critical E2E test for the escrow system
  656 |     // Uses API calls directly for reliability
  657 | 
  658 |     // ─── STEP 1: Create booking as guest user ───
  659 |     console.log('Step 1: Creating test booking as guest user...');
  660 | 
  661 |     const guestUser = await prisma.user.findFirst({ where: { email: 'guest@gofishi.com' } });
  662 |     const tripMaster = await prisma.tripMaster.findFirst({ where: { status: 'SEARCHING' } });
  663 | 
  664 |     if (!guestUser || !tripMaster) {
  665 |       throw new Error('Missing test data: guest user or trip master');
  666 |     }
  667 | 
  668 |     const booking = await prisma.tripBooking.create({
  669 |       data: {
  670 |         tripMasterId: tripMaster.id,
  671 |         userId: guestUser.id,
  672 |         seatsBooked: 2,
  673 |         totalAmount: 200000,
  674 |         paymentStatus: 'PENDING',
  675 |         manifests: {
  676 |           create: [
  677 |             { name: 'Guest User 1' },
  678 |             { name: 'Guest User 2' },
  679 |           ]
  680 |         }
  681 |       }
  682 |     });
  683 |     console.log(`✓ Booking created: ${booking.id}`);
  684 | 
  685 |     // ─── STEP 2: Simulate Midtrans settlement webhook ───
  686 |     console.log('Step 2: Simulating Midtrans settlement (PENDING → HELD)...');
  687 |     const context = await request.newContext();
  688 |     const amount = '200000.00';
  689 | 
  690 |     const validSignature = generateMidtransSignature(
  691 |       booking.id,
  692 |       '200',
  693 |       amount,
  694 |       MIDTRANS_SERVER_KEY
```