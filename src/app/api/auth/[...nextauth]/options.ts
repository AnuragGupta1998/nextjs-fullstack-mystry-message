import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any> {

                await dbConnect();
                
                try {
                    //find user in db using username or email
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    });

                    if(!user){
                        throw new Error('No User Found with this Email / Username')
                    }

                    if(!user.isVerified){
                        throw new Error("please Verify Email first")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password , user.password)

                    if(isPasswordCorrect){ 
                        return user;
                    }
                    else{
                        throw new Error("please Check your Password Please ")
                    }

                } catch (error: any) {
                    throw new Error(error)

                }
            }
        })
    ],

    //Callbacks are asynchronous functions you can use to control what happens when an action is performed.
    callbacks:{

        async jwt({token,user}) {

           if (user) {
             token._id = user._id;
             token.username = user.username;
             token.isVerified = user.isVerified
             token.isAcceptingMessages = user.isAcceptingMessages;
           }

            return token   
        },

        async session({ session, token }) {

            if (token) {
              session.user._id = token._id;
              session.user.isVerified = token.isVerified;
              session.user.isAcceptingMessages = token.isAcceptingMessages;
              session.user.username = token.username;
            }

            return session;

        },
    },

    pages:{
        signIn:"/sign-in"
    },

    secret:process.env.NEXTAUTH_URL,

    session:{
        strategy:"jwt"
    },

}
