import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helper/sendVerificationEmail";



export async function POST(request: Request) {

    console.log("signup route")
    await dbConnect();//as request comes it connect to DB

    try {

        console.log("try part sign up")

        const { username, email, password } = await request.json();

        console.log("username" + username)
        console.log("email" + email)
        console.log("password" + password)

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        console.log("existingUserVerifiedByUsername",existingUserVerifiedByUsername)

        if (existingUserVerifiedByUsername) {
            console.log("existingUserVerifiedByUsername")
            return Response.json(
                {
                    message: "User already exist",
                    success: false,
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        console.log("existingUserByEmail", existingUserByEmail)

        const verifyCode = Math.floor(100000 + Math.random()*900000+1).toString(); // 6 digit otp generate here

        if (existingUserByEmail) {

            console.log("existingUserByEmail")

            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        message:"user already exist by this email",
                        success:false
                    },
                    {
                        status:400
                    }
                )
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);

                existingUserByEmail.password         = hashedPassword;
                existingUserByEmail.isVerified       = false;
                existingUserByEmail.verifyCode       = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

                await existingUserByEmail.save();
                
            }

        }
        else {
            console.log("else part user not created yet")
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("hashedPassword",hashedPassword)

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1) //for 1 hours

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });
            console.log("newUser", newUser)

            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(email,username,verifyCode)

        if(!emailResponse.success){
            return Response.json(
                {
                  message:emailResponse.message,
                  success:false,
                },
                {
                    status:500
                }
            )
        }

        return Response.json(
            {
              message:"User Registered Successfully and Please verify your email",
              success:true,
            },
            {
                status:201
            }
        )

    } catch (error) {
        console.log("faild to signup/registering user",error)
        
        return Response.json(
            {
                success: false,
                message: "error while registering user"
            },
            {
                status: 500
            }
        )

    }

}