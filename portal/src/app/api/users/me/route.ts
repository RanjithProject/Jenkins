


import { NextRequest, NextResponse } from "next/server";
// import { getDataFromToken } from "@/helpers/getDataFromToken";

import User from "@/models/userModel";
import { getDataFromToken } from "../getDataFromToken/route";
// import User from "@/models/UserModel";

// import { Connect } from "@/dbConfig/dbConfig";

export async function GET(request: NextRequest) {
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User found", data: user });
    } catch (error) {
        console.error("Fetch user error:", error);
        return NextResponse.json({ error: "An error occurred." }, { status: 400 });
    }
}



