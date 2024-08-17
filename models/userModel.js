const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength:[2,'A Name must be atleast 2 Letters'],
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true,
        minlength: [8, 'Password should be atleast 8 characters'],
    },
    token:{
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    blogs:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Blog'
        }
    ]
});

const User = mongoose.model('User',userSchema);

module.exports = User;