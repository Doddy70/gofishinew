import { z } from "zod";

export const verifyKaptenSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  status: z.enum(["APPROVED", "REJECTED"], {
    errorMap: () => ({ message: "Status must be either APPROVED or REJECTED" }),
  }),
});

export type VerifyKaptenInput = z.infer<typeof verifyKaptenSchema>;
