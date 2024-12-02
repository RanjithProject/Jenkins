

import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { tenantId} = reqBody;
console.log(tenantId);

await connect(tenantId);

    const user = await User.findOne({tenantId});

    // console.log(user);
    
    if(!user){
        return NextResponse.json(
            {error: "User Does Not Exist!"},
            {status : 400}
        )
    }

    console.log("the email value is : ",user.email);
    
    const email=user.email;

    console.log(reqBody);
    await sendEmail({tenantId, email, emailType: "RESET", userId: user._id});
  
    return NextResponse.json({
      message: "Email Sent",
      success: true
  })


  } catch (error: any) {
    return NextResponse.json({error:error.message},{status:500})

  }
}
