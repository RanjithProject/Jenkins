// import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";

// export async function POST(request: NextRequest) {
//   try {
//     // Establish the connection to the database
//     await connect();

//     // Parse the JSON request body
//     const reqBody = await request.json();
//     const { 
//       username, email, password, employeeId, 
//       userrole, hrEmployeeId, hrEmail, managerEmployeeId, managerEmail 
//     } = reqBody;

//     // Basic validation for the required fields
//     if (!username || !email || !password || !employeeId || !userrole) {
//       return NextResponse.json(
//         { error: "Username, email, employeeId, password, and role are required." },
//         { status: 400 }
//       );
//     }

//     // Validate the role field
//     const validRoles = ['employee', 'hr', 'manager'];
//     if (!validRoles.includes(userrole)) {
//       return NextResponse.json(
//         { error: `Invalid role. Allowed roles are: ${validRoles.join(", ")}.` },
//         { status: 400 }
//       );
//     }

//     // Check if the user with the same email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User with this email already exists." },
//         { status: 400 }
//       );
//     }

//     // Handle employee role signup: Verify HR's employeeId and email
//     if (userrole === 'employee') {
//       if (!hrEmployeeId || !hrEmail) {
//         return NextResponse.json(
//           { error: "HR Employee ID and HR Email are required for employee signup." },
//           { status: 400 }
//         );
//       }

//       const hrExists = await User.findOne({ employeeId: hrEmployeeId, email: hrEmail, userrole: 'hr' });
//       if (!hrExists) {
//         return NextResponse.json(
//           { error: "HR with the provided employeeId and email does not exist." },
//           { status: 400 }
//         );
//       }

//       // Check if the employeeId already exists
//       const existingEmployeeId = await User.findOne({ employeeId });
//       if (existingEmployeeId) {
//         return NextResponse.json(
//           { error: "Employee ID already exists." },
//           { status: 400 }
//         );
//       }
//     }

//     // Handle HR role signup: Verify Manager's employeeId and email
//     if (userrole === 'hr') {
//       if (!managerEmployeeId || !managerEmail) {
//         return NextResponse.json(
//           { error: "Manager Employee ID and Manager Email are required for HR signup." },
//           { status: 400 }
//         );
//       }

//       const managerExists = await User.findOne({ employeeId: managerEmployeeId, email: managerEmail, userrole: 'manager' });
//       if (!managerExists) {
//         return NextResponse.json(
//           { error: "Manager with the provided employeeId and email does not exist." },
//           { status: 400 }
//         );
//       }
//     }

//     // Hash the password using bcrypt
//     const salt = await bcryptjs.genSalt(10);
//     const hashedPassword = await bcryptjs.hash(password, salt);

//     // Default shift details (morning shift) for all users
//     const shiftDetails = getShiftDetails("morning");

//     // Create the new user based on the role
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//       employeeId,
//       userrole,
//       hrEmployeeId: userrole === 'hr' ? null : hrEmployeeId, // HR doesn't need hrEmployeeId
//       hrEmail: userrole === 'hr' ? null : hrEmail, // HR doesn't need hrEmail
//       managerEmployeeId: userrole === 'manager' ? null : managerEmployeeId, // Manager doesn't need managerEmployeeId
//       managerEmail: userrole === 'manager' ? null : managerEmail, // Manager doesn't need managerEmail
//       isVerified: false,
//       isAdmin: userrole === 'manager', // Set admin to true for managers
//       shift: shiftDetails
//     });

//     // Save the new user to the database
//     await newUser.save();

//     // Return a success response
//     return NextResponse.json(
//       { message: "User created successfully." },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     // Log the error for debugging and send the error message as a response
//     console.error("Error during user registration:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to get shift details based on the shiftType provided (defaults to morning shift)
// function getShiftDetails(shiftType: string) {
//   const currentDate = new Date();

//   // Default to morning shift if no shiftType is provided
//   return {
//     shiftType: 'morning',
//     startTime: currentDate.setHours(9, 0, 0, 0),  // 9:00 AM
//     endTime: currentDate.setHours(18, 0, 0, 0),   // 6:00 PM
//     shiftName: 'Morning Shift'
//   };
// }













import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        // Establish the connection to the database
        await connect();

        // Parse the JSON request body
        const reqBody = await request.json();
        const { username, email, password, employeeId, userrole, shiftType } = reqBody;
        console.log(username, email, password, employeeId, userrole, shiftType);

        // Basic validation for the required fields
        if (!username || !email || !password || !employeeId || !userrole) {
            return NextResponse.json(
                { error: "Username, email, employeeId, password, and role are all required." },
                { status: 400 }
            );
        }

        // Validate the role field
        const validRoles = ['employee', 'hr', 'manager'];
        if (!validRoles.includes(userrole)) {
            return NextResponse.json(
                { error: `Invalid role. Allowed roles are: ${validRoles.join(", ")}.` },
                { status: 400 }
            );
        }

        // Check if the employeeId already exists
        const existingEmployeeId = await User.findOne({ employeeId });
        if (existingEmployeeId) {
            return NextResponse.json(
                { error: "Employee ID already exists." },
                { status: 400 }
            );
        }

        // Check if the user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists." },
                { status: 400 }
            );
        }

        // Hash the password using bcrypt
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Determine shift based on shiftType, or default to 'morning'
        let shift = {};
        const currentDate = new Date();

        switch (shiftType) {
            case 'morning':
                shift = {
                    shiftType: 'morning',
                    startTime: currentDate.setHours(9, 0, 0, 0), // 9:00 AM
                    endTime: currentDate.setHours(18, 0, 0, 0), // 6:00 PM
                    shiftName: 'Morning Shift'
                };
                break;
            case 'midshift':
                shift = {
                    shiftType: 'midshift',
                    startTime: currentDate.setHours(14, 0, 0, 0), // 2:00 PM
                    endTime: currentDate.setHours(23, 0, 0, 0), // 11:00 PM
                    shiftName: 'Mid Shift'
                };
                break;
            case 'nightshift':
                shift = {
                    shiftType: 'nightshift',
                    startTime: currentDate.setHours(18, 0, 0, 0), // 6:00 PM
                    endTime: currentDate.setHours(3, 0, 0, 0), // 3:00 AM (next day)
                    shiftName: 'Night Shift'
                };
                break;
            default:
                // Default to morning shift if no shiftType provided
                shift = {
                    shiftType: 'morning',
                    startTime: currentDate.setHours(9, 0, 0, 0), // 9:00 AM
                    endTime: currentDate.setHours(18, 0, 0, 0), // 6:00 PM
                    shiftName: 'Morning Shift'
                };
                break;
        }

        // Create a new user document with all the provided fields, including the shift information
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            employeeId,
            userrole, // Add role to the new user
            shift, // Add the selected shift for the user
        });

        // Save the new user to the database
        await newUser.save();

        // Return a success response
        return NextResponse.json(
            { message: "User created successfully." },
            { status: 201 }
        );
    } catch (error: any) {
        // Log the error for debugging and send the error message as a response
        console.error("Error during user registration:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}