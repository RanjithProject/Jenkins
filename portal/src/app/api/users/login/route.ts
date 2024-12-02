

import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {

    // await connect(tenantId);
    try {
        const reqBody = await request.json();
        const { email, password,employeeId} = reqBody;
        
console.log(email, password,employeeId);

     
        await connect();

//         const employeeIdFind=await User.findOne({employeeId});
// if(!employeeIdFind){
//     return NextResponse.json({error:"Employee Id is Not Found"},{status:400});
// }

        const user = await User.findOne({ email,employeeId });
        if (!user) {
            return NextResponse.json({ error: "User (email Id Or employee Id) does not exist" }, { status: 400 });
        }



        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const tokendata = {
            id: user._id,
            email: user.email,
            username: user.username,
            userrole:user.userrole   
        };
        const token = jwt.sign(tokendata, process.env.TOKEN_SECRET!, { expiresIn: "1h" });

        const response = NextResponse.json({ message: "Login successful", token }, { status: 200 });
        response.cookies.set("token", token, { httpOnly: true });

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
