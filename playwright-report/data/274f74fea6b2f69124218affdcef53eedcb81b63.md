# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: midtrans-sandbox.spec.ts >> Midtrans Webhook - Escrow Status Transitions >> 07 - Deny → Payment REFUNDED, seats restored
- Location: e2e/midtrans-sandbox.spec.ts:390:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "REFUNDED"
Received: "PENDING"
```

# Test source

```ts
  327 |         fraud_status: 'none',
  328 |       },
  329 |       headers: { 'Content-Type': 'application/json' },
  330 |     });
  331 | 
  332 |     // Verify booking status updated to REFUNDED
  333 |     const booking = await prisma.tripBooking.findUnique({
  334 |       where: { id: bookingId },
  335 |     });
  336 |     expect(booking?.paymentStatus).toBe('REFUNDED');
  337 | 
  338 |     // Verify seats restored
  339 |     tripMaster = await prisma.tripMaster.findUnique({
  340 |       where: { id: tripMasterId },
  341 |     });
  342 |     expect(tripMaster!.currentSeats).toBe(initialSeats + 2);
  343 |   });
  344 | 
  345 |   test('06 - Cancel → Payment REFUNDED, seats restored', async () => {
  346 |     const context = await request.newContext();
  347 | 
  348 |     const { bookingId, tripMasterId } = await createTestBooking(2);
  349 |     const amount = '200000.00';
  350 | 
  351 |     // Get initial seats
  352 |     let tripMaster = await prisma.tripMaster.findUnique({
  353 |       where: { id: tripMasterId },
  354 |     });
  355 |     const initialSeats = tripMaster!.currentSeats;
  356 | 
  357 |     const validSignature = generateMidtransSignature(
  358 |       bookingId,
  359 |       '200',
  360 |       amount,
  361 |       MIDTRANS_SERVER_KEY
  362 |     );
  363 | 
  364 |     // Send cancel webhook
  365 |     await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  366 |       data: {
  367 |         order_id: bookingId,
  368 |         transaction_status: 'cancel',
  369 |         status_code: '200',
  370 |         gross_amount: amount,
  371 |         signature_key: validSignature,
  372 |         fraud_status: 'accept',
  373 |       },
  374 |       headers: { 'Content-Type': 'application/json' },
  375 |     });
  376 | 
  377 |     // Verify booking status updated to REFUNDED
  378 |     const booking = await prisma.tripBooking.findUnique({
  379 |       where: { id: bookingId },
  380 |     });
  381 |     expect(booking?.paymentStatus).toBe('REFUNDED');
  382 | 
  383 |     // Verify seats restored
  384 |     tripMaster = await prisma.tripMaster.findUnique({
  385 |       where: { id: tripMasterId },
  386 |     });
  387 |     expect(tripMaster!.currentSeats).toBe(initialSeats + 2);
  388 |   });
  389 | 
  390 |   test('07 - Deny → Payment REFUNDED, seats restored', async () => {
  391 |     // Fraud status 'deny' should also trigger refund
  392 | 
  393 |     const context = await request.newContext();
  394 | 
  395 |     const { bookingId, tripMasterId } = await createTestBooking(1);
  396 |     const amount = '100000.00';
  397 | 
  398 |     let tripMaster = await prisma.tripMaster.findUnique({
  399 |       where: { id: tripMasterId },
  400 |     });
  401 |     const initialSeats = tripMaster!.currentSeats;
  402 | 
  403 |     const validSignature = generateMidtransSignature(
  404 |       bookingId,
  405 |       '200',
  406 |       amount,
  407 |       MIDTRANS_SERVER_KEY
  408 |     );
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
> 427 |     expect(booking?.paymentStatus).toBe('REFUNDED');
      |                                    ^ Error: expect(received).toBe(expected) // Object.is equality
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
```