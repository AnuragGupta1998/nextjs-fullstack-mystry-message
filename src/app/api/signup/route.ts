import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest,NextResponse } from "next/server";
import Router from "next/router";
import { ApiResponse } from "@/types/ApiResponse";


dbConnect()

export async function POST(request:NextRequest) {
    try {
        const reqBody = request.json();
        const{username,email,password} :any = reqBody;

        const user = await UserModel.findOne({email})

        if(user){
            return NextResponse.json({
                message:"user exits"
            })
        }

        const userCreated = await UserModel.create({
            username,
            email,
            password
        })

        return NextResponse.json({
            message:"user created",
            data:userCreated
        })

        
    } catch (error) {
        console.log("faild to signup user")
        return;
        
    }
    
}