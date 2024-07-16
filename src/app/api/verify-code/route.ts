import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username); //to remove % and other from url

        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 400 }
            );
        }
        const isCodeValid = user.verifyCode === code;
        const iscodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && iscodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                { success: true, message: 'Account verified successfully' },
                { status: 200 }
            );
        } else if (!iscodeNotExpired) {
            //code is expired
            return Response.json(
                { success: false, message: ' Verification code has expired. Please sign up again to get a new code.' },
                { status: 400 }
            );
        } else {
            //code is incorrect
            return Response.json(
                { success: false, message: 'incorrect verification code' },
                { status: 200 }
            );
        }

    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json(
            { success: false, message: 'Error verifying user' },
            { status: 500 }
        );
    }
}