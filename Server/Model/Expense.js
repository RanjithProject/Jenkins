// // models/Expense.js
// const mongoose = require('mongoose');

// // Define the Expense schema
// const expenseSchema = new mongoose.Schema({
//   employeeId: {
//     type: String,
//     required: [true, "Employee ID is required"],
//   },
//   employeeEmail: {
//     type: String,
//     required: [true, "Employee Email is required"],
//   },
//   expenseType: {
//     type: String,
//     required: [true, "Expense Type is required"],
//     enum: ['Travel', 'Meals', 'Office Supplies', 'Other'], // Example categories
//   },
//   amount: {
//     type: Number,
//     required: [true, "Amount is required"],
//   },
//   description: {
//     type: String,
//     required: [true, "Description of the expense is required"],
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Approved', 'Declined'],
//     default: 'Pending',  
//   },
//   managerId: {
//     type: String,
//     required: [true, "Manager ID is required"],
//   },
//   managerEmail: {
//     type: String,
//     required: [true, "Manager Email is required"],
//   },
// });

// // Export the Expense model
// const Expense = mongoose.model('Expense', expenseSchema);

// module.exports = Expense;




const mongoose = require('mongoose');

// Define the Expense schema
const expenseSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeEmail: { type: String, required: true },
  expenseAmount: { type: Number, required: true },
  expenseDescription: { type: String, required: true },
  managerId: { type: String, required: true },
  managerEmail: { type: String, required: true },
  expenseType: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  reason: { type: String }  // Optional field for declined expenses
});

// Create the Expense model from the schema
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
