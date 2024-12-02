const mongoose = require('mongoose');

// Leave Approval Schema
const leaveApprovalSchema = new mongoose.Schema({
  // Reference to the User (Employee) model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Leave Request ID from the Employee (can be referenced from the User model)
  leaveRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User.leave', 
    required: true,
  },

  // Leave Type (Personal, Sick, etc.)
  leaveType: {
    type: String,
    required: true,
    enum: ['Personal Reason', 'Sick Leave', 'Vacation', 'Other'],
  },

  // Leave Dates
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },

  // Reason for the leave
  reason: {
    type: String,
    required: true,
  },

  // Leave Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending', // Default status is 'pending'
  },

  // Admin Approval/Denial
  adminComments: {
    type: String,
    required: false, // Admin can add comments about approval or denial
    default: '',
  },

  // Date when the leave approval was made
  approvalDate: {
    type: Date,
    required: false,
  },

  // The user (admin/manager) who made the approval decision
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: false,
  },

  // Created at timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Updated at timestamp (for tracking updates)
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updatedAt` field on each update
leaveApprovalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// LeaveApproval model
let LeaveApproval;
if (mongoose.modelNames().includes('LeaveApproval')) {
  LeaveApproval = mongoose.model('LeaveApproval');
} else {
  LeaveApproval = mongoose.model('LeaveApproval', leaveApprovalSchema);
}

module.exports = LeaveApproval;
