import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Doctor', 'Administrator', 'Receptionist']
  },

}, { timestamps: true });


userSchema.pre('login', async function () {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
    ()

})

const userModel = mongoose.model('User', userSchema);

export default userModel;