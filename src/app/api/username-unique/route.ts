import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { z } from "zod"
import { usernameValidation } from '@/schemas/signUpSchema'

const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = { username : searchParams.get('username') };

        //validate queryParams with zod
        const result = UsernameQuerySchema.safeParse(queryParams);

        //todo remove
        console.log("Result in username-unique ", result)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "  Invalid query parameters "
                },
                {
                    status: 400
                }
            )
        }

        const {username} = result.data;
        console.log("username",username)
        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})

        if(existingVerifiedUser){
            return Response.json(
                {
                    success:false,
                    message:'username is already taken'
                },
                {
                    status:400
                }
            )
        }

        return Response.json(
            {
                success:true,
                message:'Username is available'
            },
            {
                status:200
            }
        )


    } catch (error) {
        console.log("error while checking username || not unique ", error);
        return Response.json({
            success: false,
            message: "error username is not unique || try with new username"
        })
    }

}
