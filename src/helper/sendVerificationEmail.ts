import { resend } from "@/lib/resend";
import VerificationEmailTemplate from "../../emails/VerificationEmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string     //OTP
): Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email, 
            subject: 'Mystry Message Verification Code',
            react: VerificationEmailTemplate({ username, otp: verifyCode }),
        });

        return { success: true, message: "successfully send Verification email" }

    } catch (error) {
        console.log("Error during sending verification email", error);
        return { success: false, message: "failed to send verification email" }

    }

}