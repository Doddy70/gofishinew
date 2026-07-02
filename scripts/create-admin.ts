import { auth } from "../src/lib/auth";

async function createAdmin() {
    try {
        const user = await auth.api.signUpEmail({
            body: {
                email: "admin@gofishi.com",
                password: "admin123",
                name: "Admin GoFishi",
            }
        });

        console.log("User created successfully");

        // Now upgrade to ADMIN role using prisma directly since signUpEmail defaults to GUEST/HOST
        // We need to import prisma
        const { default: prisma } = await import("../src/lib/prisma");
        
        await prisma.user.update({
            where: { email: "admin@gofishi.com" },
            data: { role: "ADMIN" }
        });

        console.log("User upgraded to ADMIN role");
    } catch (error) {
        console.error("Error creating admin:", error);
    }
}

createAdmin();
