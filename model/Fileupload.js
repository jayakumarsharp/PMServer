import mongoose from 'mongoose';

const fileUploadSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
});


const security = mongoose.model('FileUpload', fileUploadSchema);

export default security;