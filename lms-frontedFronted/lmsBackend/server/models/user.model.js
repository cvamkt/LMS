// const {Schema, Schema } = require("mongoose");
import { Schema, model } from 'mongoose';
// const bcrypt = require('bcryptjs');
import bcrypt from 'bcryptjs';
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
// const crypto = require('crypto');
import crypto from 'crypto';

const userSchema = new Schema({
    fullName: {
        type: 'String',
        required: [true, 'Nmae is required'],
        minLength: [5, 'Name must be at least 5 character'],
        maxLength: [50, 'Name must less than 50 characaters'],
        lowercase:  true,
        trim: true,  // trim means starting n eding space on filling time must be remove 
    },
    email:{
        type: 'String',
        required: [true, ' email is required'],
        lowercase: true,
        trim: true,
        unique: true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please fill in a valid email address',
        ],
    },
    password: {
        type: 'String',
        required: [true, 'password is required'],
        minLength: [8, 'password must at least 8 characters'],
        select: false,
    },

    avatar: {
       public_id:{
        type: 'String'
       } ,
       secure_url: {
        type: 'String'
       }
    },
    role:{
        type: 'String',
        enum: ['USER','ADMIN'],
        default: 'USER'
    },

    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
    subscription:{
        id: String,
        status: String
    }


}, {
    timestamps: true
});

userSchema.pre('save',async function(next){
     if(!this.isModified('password')){
       return next();
     }
     this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods = {
    generateJWTToken: async function() {
        return await jwt.sign(
            {id: this._id, email: this.email, subscription: this.subscription, role: this.role},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            }
        )
    },
    comparePassword: async function(plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    },

    generatePasswordResetToken:async function(){
      const resetToken = crypto.randomBytes(20).toString('hex');
       
      this.forgetPasswordToken = crypto
       .createHash('sha256')  //it's a algo to encrypt
       .update(resetToken)
       .digest('hex')
       ;

      this.forgetPasswordExpiry = Date.now() + 15 *60 * 1000; // 15 min from now
    
      return resetToken;

    }


}

const User = model('User', userSchema);

// module.exports = User;
export default User;