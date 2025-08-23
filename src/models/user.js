const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required : true,
    minLength : 4,
    maxLength : 50,
  },
  LastName: {
    type: String,
  },
  emailId : {
    type: String,
    required : true,
    trim : true,
    lowercase : true,
    unique : true,
    validate(value){
      if(!validator.isEmail(value)){
          throw new Error("Invalid email address:" +value);
      }
    },

  },
  password : {
    type: String,
    required : true,
    validate(value){
      if(!validator.isStrongPassword(value)){
          throw new Error("Not a strong password:" +value);
      }
    },
  },
  age : {
    type: Number,
    required : true,
    min : 18,
  },
  gender : {
    required : true,
    type: String,
    enum : {
      values : ["male" , "female" ,"others"],
      message:  '{VALUE} is not a valid gender type'
    },
    
    // validate(value){
    //   if(!["female","male","others"].includes(value)){
    //     throw new Error("Gender data not valid");
    //   }
    // },
  },
  isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
  photoUrl : {
    type : String,
    default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.inforwaves.com%2Fhome-2%2Fdummy-profile-pic-300x300-1%2F&psig=AOvVaw3wd9qgaN7RwAAMoLK9fM-G&ust=1749234289435000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjb-dXz2o0DFQAAAAAdAAAAABAE",
    validate(value){
      if(!validator.isURL(value)){
          throw new Error("Incorrect URL:" +value);
      }
    },

  },
  about :{
    type : String,
    default : "This is default about of the user",
  },

  skills : {
    type : [String],

  }
},
{
  timestamps : true,
}
);
userSchema.index({firstName : 1 , LastName : 1});
userSchema.methods.getJWT = async function () { // never ever use arrow func with this 
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790",{
  expiresIn:"1d",
});
  return token;
};
userSchema.methods.validatePassword = async function(passwordInputByUser) {
  const user = this;
  const  passwordHash = user.password;
  const ispasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash); 
  return ispasswordValid;
}
const User = mongoose.model("User" , userSchema);
module.exports = User;
