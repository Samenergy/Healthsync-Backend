import mongoose from 'mongoose';

const PetientSchema =new mongoose.Schema({

    

},{
    timestamps:true
});

const petientModel = mongoose.model('petient record',petientSchema);

export default petientModel;