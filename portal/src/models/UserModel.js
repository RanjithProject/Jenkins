import mongoose from "mongoose";

// Define the shift schema
const shiftSchema = new mongoose.Schema({
  shiftType: {
    type: String,
    enum: ['morning', 'midshift', 'nightshift'], // Shift types: morning, midshift, nightshift
    required: true,
    default: 'morning', // Default shift type is morning
  },
  startTime: {
    type: Date,
    required: true,
    default: function() {
      const date = new Date();
      switch (this.shiftType) {
        case 'morning':
          date.setHours(9, 0, 0, 0); // Morning shift: 9:00 AM
          break;
        case 'midshift':
          date.setHours(14, 0, 0, 0); // Midshift: 2:00 PM
          break;
        case 'nightshift':
          date.setHours(18, 0, 0, 0); // Nightshift: 6:00 PM
          break;
        default:
          date.setHours(9, 0, 0, 0); // Default to morning if no valid shiftType is provided
          break;
      }
      return date;
    }
  },
  endTime: {
    type: Date,
    required: true,
    default: function() {
      const date = new Date();
      switch (this.shiftType) {
        case 'morning':
          date.setHours(18, 0, 0, 0); // Morning shift: 6:00 PM
          break;
        case 'midshift':
          date.setHours(23, 0, 0, 0); // Midshift: 11:00 PM
          break;
        case 'nightshift':
          date.setHours(3, 0, 0, 0); // Nightshift: 3:00 AM (next day)
          break;
        default:
          date.setHours(18, 0, 0, 0); // Default to 6:00 PM if no valid shiftType is provided
          break;
      }
      return date;
    }
  },
  shiftName: {
    type: String,
    required: true,
    default: function() {
      switch (this.shiftType) {
        case 'morning':
          return 'Morning Shift'; // Morning Shift: 9:00 AM to 6:00 PM
        case 'midshift':
          return 'Mid Shift'; // Mid Shift: 2:00 PM to 11:00 PM
        case 'nightshift':
          return 'Night Shift'; // Night Shift: 6:00 PM to 3:00 AM
        default:
          return 'Morning Shift'; // Default to morning shift if no valid shiftType is provided
      }
    }
  },
});

// Define the user schema
const userSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, "Please provide an Employee Id"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
  },
  userrole: {
    type: String,
    required: [true, "Please provide a role"],
    enum: ['employee', 'hr', 'manager'],  
    message: '{VALUE} is not a valid role', 
  },
  email: {
    type: String,
    required: [true, "Please provide an email address"],
    unique: true,
    lowercase: true,  
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,

  // Adding the shift field to the user schema
  shift: {
    type: shiftSchema, // Reference to the shift schema
    required: false, // Optional field
  },
});

// Create and export the User model, checking if it already exists
let User;
if (mongoose.modelNames().includes("EmployeeModelDemo12")) {
  User = mongoose.model("EmployeeModelDemo12");
} else {
  User = mongoose.model("EmployeeModelDemo12", userSchema);
}

export default User;



