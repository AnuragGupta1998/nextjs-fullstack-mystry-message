import {z} from "zod";

export const usernameValidation = z
   .string()
   .min(2,"username must be alteast 2 character")
   .max(20,"username must not be more than 20 character")
   .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"invalid email"}),
    password:z.string().min(6,{message:"password must be atleast 6 charachter"}),
});


   