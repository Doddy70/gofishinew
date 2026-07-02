import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
        requireEmailVerification: false
    },
    socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "GUEST"
            },
            hostStatus: {
                type: "string",
                required: false,
                defaultValue: "NONE"
            },
            isVerified: {
                type: "boolean",
                required: false,
                defaultValue: false
            },
            commissionRate: {
                type: "number",
                required: false,
                defaultValue: 10.0
            }
        }
    },
    plugins: [
        twoFactor({
            issuer: "GoFishi",
        })
    ]
});