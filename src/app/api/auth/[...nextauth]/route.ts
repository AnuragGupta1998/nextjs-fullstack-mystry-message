import nextAuth from "next-auth";
import { authOptions } from "./options";

const handler = nextAuth(authOptions);

export {handler as POST , handler as GET}