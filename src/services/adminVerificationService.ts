import { UserRepository } from "@/repositories/UserRepository";
import { verifyKaptenSchema, VerifyKaptenInput } from "@/validators/admin.schema";

export class AdminVerificationService {
  constructor(private readonly userRepository: UserRepository) {}

  async verifyKapten(input: VerifyKaptenInput) {
    // 1. Validate input strictly using Zod
    const validatedData = verifyKaptenSchema.parse(input);

    // 2. Perform business logic (e.g., checking if user exists could be done here if needed)
    // For now, we directly update the status through the repository
    const updatedUser = await this.userRepository.updateKaptenStatus(
      validatedData.userId,
      validatedData.status
    );

    return updatedUser;
  }
}

// Optionally export a singleton if dependency injection container is not used
import { userRepository } from "@/repositories/UserRepository";
export const adminVerificationService = new AdminVerificationService(userRepository);
