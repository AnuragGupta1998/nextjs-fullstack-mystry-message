import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"
import Router from "next/router";
import { ApiResponse } from "@/types/ApiResponse";



export async function POST(request: NextRequest) {

    await dbConnect();//as request comes it connect to DB

    try {
        const reqBody = await request.json();
        const { username, email, password }: any = reqBody;

        const user = await UserModel.findOne({ email })

        if (user) {
            return NextResponse.json({
                message: "user exits"
            })
        }

        const userCreated = await UserModel.create({
            username,
            email,
            password
        })

        return NextResponse.json({
            message: "user created",
            data: userCreated
        })


    } catch (error) {
        console.log("faild to signup user")
        return NextResponse.json(
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