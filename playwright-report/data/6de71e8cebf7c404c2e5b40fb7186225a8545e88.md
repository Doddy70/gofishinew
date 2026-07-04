# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: midtrans-sandbox.spec.ts >> Midtrans Webhook - Signature Verification >> 01 - Reject webhook with invalid signature
- Location: e2e/midtrans-sandbox.spec.ts:145:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 403
Received: 200
```

# Test source

```ts
  68  |     }
  69  | 
  70  |     const futureDate = new Date();
  71  |     futureDate.setDate(futureDate.getDate() + 7);
  72  | 
  73  |     tripMaster = await prisma.tripMaster.create({
  74  |       data: {
  75  |         listingId: listing.id,
  76  |         dateStart: futureDate,
  77  |         dateEnd: new Date(futureDate.getTime() + 24 * 60 * 60 * 1000),
  78  |         bookingType: 'SHARING',
  79  |         priceTotal: totalAmount * 2,
  80  |         pricePerSeat: totalAmount,
  81  |         minSeats: 1,
  82  |         maxSeats: 5,
  83  |         currentSeats: 5,
  84  |         status: 'SEARCHING',
  85  |       },
  86  |     });
  87  |   }
  88  | 
  89  |   // Find a test user
  90  |   const user = await prisma.user.findFirst({ where: { role: 'GUEST' } });
  91  |   if (!user) {
  92  |     throw new Error('No test user found');
  93  |   }
  94  | 
  95  |   // Create booking
  96  |   const booking = await prisma.tripBooking.create({
  97  |     data: {
  98  |       tripMasterId: tripMaster.id,
  99  |       userId: user.id,
  100 |       seatsBooked: seatsBooked,
  101 |       totalAmount,
  102 |       paymentStatus: 'PENDING',
  103 |     },
  104 |   });
  105 | 
  106 |   return {
  107 |     bookingId: booking.id,
  108 |     tripMasterId: tripMaster.id,
  109 |     userId: user.id,
  110 |   };
  111 | }
  112 | 
  113 | /**
  114 |  * Cleanup test booking
  115 |  */
  116 | async function cleanupTestBooking(bookingId: string) {
  117 |   try {
  118 |     // Get booking to restore seats
  119 |     const booking = await prisma.tripBooking.findUnique({
  120 |       where: { id: bookingId },
  121 |       include: { tripMaster: true },
  122 |     });
  123 | 
  124 |     if (booking) {
  125 |       // Restore seats to trip master
  126 |       await prisma.tripMaster.update({
  127 |         where: { id: booking.tripMasterId },
  128 |         data: {
  129 |           currentSeats: booking.tripMaster.currentSeats + booking.seatsBooked,
  130 |           status: 'SEARCHING',
  131 |         },
  132 |       });
  133 | 
  134 |       // Delete booking
  135 |       await prisma.tripBooking.delete({ where: { id: bookingId } });
  136 |     }
  137 |   } catch {
  138 |     // Ignore cleanup errors
  139 |   }
  140 | }
  141 | 
  142 | // ─── Test Suite: Midtrans Webhook ─────────────────────────────────────────────
  143 | 
  144 | test.describe('Midtrans Webhook - Signature Verification', () => {
  145 |   test('01 - Reject webhook with invalid signature', async () => {
  146 |     const context = await request.newContext();
  147 | 
  148 |     // Create test booking
  149 |     const { bookingId } = await createTestBooking();
  150 |     const amount = '100000.00';
  151 | 
  152 |     // Send webhook with WRONG signature
  153 |     const response = await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  154 |       data: {
  155 |         order_id: bookingId,
  156 |         transaction_status: 'settlement',
  157 |         status_code: '200',
  158 |         gross_amount: amount,
  159 |         signature_key: 'invalid_signature_hash',
  160 |         fraud_status: 'accept',
  161 |       },
  162 |       headers: {
  163 |         'Content-Type': 'application/json',
  164 |       },
  165 |     });
  166 | 
  167 |     // Should return 403 Forbidden for invalid signature
> 168 |     expect(response.status()).toBe(403);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  169 | 
  170 |     // Cleanup
  171 |     await cleanupTestBooking(bookingId);
  172 |   });
  173 | 
  174 |   test('02 - Accept webhook with valid signature', async () => {
  175 |     const context = await request.newContext();
  176 | 
  177 |     // Create test booking
  178 |     const { bookingId } = await createTestBooking();
  179 |     const amount = '100000.00';
  180 |     const statusCode = '200';
  181 | 
  182 |     // Generate valid signature
  183 |     const validSignature = generateMidtransSignature(
  184 |       bookingId,
  185 |       statusCode,
  186 |       amount,
  187 |       MIDTRANS_SERVER_KEY
  188 |     );
  189 | 
  190 |     // Send webhook with VALID signature
  191 |     const response = await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  192 |       data: {
  193 |         order_id: bookingId,
  194 |         transaction_status: 'settlement',
  195 |         status_code: statusCode,
  196 |         gross_amount: amount,
  197 |         signature_key: validSignature,
  198 |         fraud_status: 'accept',
  199 |       },
  200 |       headers: {
  201 |         'Content-Type': 'application/json',
  202 |       },
  203 |     });
  204 | 
  205 |     // Should return 200 (even on processing error, webhook returns 200)
  206 |     expect(response.status()).toBe(200);
  207 | 
  208 |     // Cleanup
  209 |     await cleanupTestBooking(bookingId);
  210 |   });
  211 | });
  212 | 
  213 | test.describe('Midtrans Webhook - Escrow Status Transitions', () => {
  214 |   test('03 - Settlement → Payment HELD', async () => {
  215 |     // This tests that successful payment transitions PENDING → HELD
  216 | 
  217 |     const context = await request.newContext();
  218 | 
  219 |     // Create test booking
  220 |     const { bookingId } = await createTestBooking();
  221 |     const amount = '100000.00';
  222 | 
  223 |     // Verify initial status is PENDING
  224 |     let booking = await prisma.tripBooking.findUnique({
  225 |       where: { id: bookingId },
  226 |     });
  227 |     expect(booking?.paymentStatus).toBe('PENDING');
  228 | 
  229 |     // Generate valid signature
  230 |     const validSignature = generateMidtransSignature(
  231 |       bookingId,
  232 |       '200',
  233 |       amount,
  234 |       MIDTRANS_SERVER_KEY
  235 |     );
  236 | 
  237 |     // Send settlement webhook
  238 |     await context.post(`${BASE_URL}/api/webhooks/midtrans`, {
  239 |       data: {
  240 |         order_id: bookingId,
  241 |         transaction_status: 'settlement',
  242 |         status_code: '200',
  243 |         gross_amount: amount,
  244 |         signature_key: validSignature,
  245 |         fraud_status: 'accept',
  246 |       },
  247 |       headers: { 'Content-Type': 'application/json' },
  248 |     });
  249 | 
  250 |     // Verify booking status updated to HELD
  251 |     booking = await prisma.tripBooking.findUnique({
  252 |       where: { id: bookingId },
  253 |     });
  254 |     expect(booking?.paymentStatus).toBe('HELD');
  255 | 
  256 |     // Cleanup
  257 |     await cleanupTestBooking(bookingId);
  258 |   });
  259 | 
  260 |   test('04 - Capture → Payment HELD (credit card)', async () => {
  261 |     // Credit card payments use 'capture' status
  262 | 
  263 |     const context = await request.newContext();
  264 | 
  265 |     const { bookingId } = await createTestBooking();
  266 |     const amount = '100000.00';
  267 | 
  268 |     const validSignature = generateMidtransSignature(
```