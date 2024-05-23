import mongoose from 'mongoose';

const signupSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  hospitalName: {
    type: String,
    trim: true,
    maxlength: 100
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
    required: true
  },
  role: {
    type: String,
    enum: ['Doctor','Administrator','Receptionist'], 
    default:'Administrator'
  },
}, { timestamps: true });

signupSchema.pre('Administrator',async function(){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    ()

})

const signupModel = mongoose.model('Administrator', signupSchema);

export default signupModel;
