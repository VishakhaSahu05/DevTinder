const mongoose = require("mongoose");
const validator = require("validator");

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
    validate(value){
      if(!["female","male","others"].includes(value)){
        throw new Error("Gender data not valid");
      }
    },
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

const User = mongoose.model("User" , userSchema);
module.exports = User;
