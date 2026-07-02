import prisma from '../src/lib/prisma';

async function testCreate() {
  try {
    const uniqueSuffix = Math.random().toString(36).substring(2, 9);
    await prisma.user.create({
      data: {
        id: `test-vendor-${uniqueSuffix}`,
        name: 'Test Vendor',
        email: `test-${uniqueSuffix}@test.com`,
        role: 'HOST',
        hostStatus: 'PENDING',
        captainLicense: 'https://example.com/license.pdf',
        boatSafetyCert: 'https://example.com/safety.pdf'
      }
    });
    console.log("SUCCESS");
  } catch (err: any) {
    console.log("PRISMA FULL ERROR:");
    console.dir(err, { depth: null });
  } finally {
    await prisma.$disconnect();
  }
}

testCreate();
