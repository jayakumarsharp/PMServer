import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  watchlist: [{ type: String }] // Assuming watchlist is an array of symbols
});


const User = mongoose.model('User', userSchema);

export default User;
