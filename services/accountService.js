const Account = require("../model/Account");
import { getbyUserId } from "./userService";

// Function to get user data by username

// Create a new account
async function createAccount(accountData) {
  try {
    const userdata = await getbyUserId(accountData.user_id);
    if (!userdata) throw new Error("User not found");
    // Map incoming fields to match the schema
    console.log("create  account called");
    const account = new Account({
      name: accountData.name,
      currency: accountData.currency,
      balance: Number(accountData.balance), // Ensure balance is a number
      platformId: accountData.platform, // Rename platform to platformId
      comment: accountData.note, // Rename note to comment
      isExcluded: accountData.isExcluded,
      user_id: userdata._id, // Set the user ID correctly
    });
    console.log(account);

    return await account.save();
  } catch (err) {
    throw new Error("Error creating account: " + err.message);
  }
}

// Update an existing account by ID
async function updAccount(accountData) {
  try {
    const account = await Account.findByIdAndUpdate(
      accountData._id, // Use the account's _id to find the document
      accountData, // The new data to update
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure the update respects schema validation
      }
    );

    if (!account) throw new Error("Account not found");
    return account;
  } catch (err) {
    throw new Error("Error updating account: " + err.message);
  }
}

// Get all accounts for a specific user
async function getAllAccountsByUser(user_id) {
  try {
    const userdata = await getbyUserId(user_id);
    if (!userdata) throw new Error("User not found");
    return await Account.find({ user_id: userdata._id });
  } catch (err) {
    throw new Error("Error retrieving accounts: " + err.message);
  }
}

// Get an account by ID
async function getAccountById(accountId) {
  try {
    const account = await Account.findById(accountId);
    if (!account) throw new Error("Account not found");
    return account;
  } catch (err) {
    throw new Error("Error retrieving account: " + err.message);
  }
}

export { createAccount, updAccount, getAllAccountsByUser, getAccountById };
