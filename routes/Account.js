import express from "express";
import {
  createAccount,
  updAccount,
  getAllAccountsByUser,
  getAccountById,
} from "../services/accountService";

const accountapiRouter = express.Router();

// Create a new account
accountapiRouter.post("/accounts", async (req, res) => {
  console.log("API invoked");
  console.log(req.body);
  const data = await createAccount(req.body);
  res.json(data);
});

// Update an account
accountapiRouter.post("/updateaccount", async (req, res) => {
  try {
    console.log("API invoked");
    console.log(req.body);
    const data = await updAccount(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
accountapiRouter.get("/accounts/:user_id", async (req, res) => {
  try {
    const user_id = req.params.user_id; // Access user_id from the query string
    console.log('called accounts for user: ' + user_id);
    
    if (!user_id) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const data = await getAllAccountsByUser(user_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// Get account by ID
accountapiRouter.get("/accountsbyId/:id", async (req, res) => {
  try {
    const data = await getAccountById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
});

export default accountapiRouter;
