const validator = require("validator");
const { validate } = require("../models/user");

const validateSignupData = (req) => {
  const { firstName, LastName, emailId, password, age, gender, photoUrl } =
    req.body;
  if (!firstName || !LastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email address is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};
const validateEditProfileData = (req) => {
  const allowedUpdates = [
    "firstName",
    "LastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedUpdates.includes(field)
  );
  if (!isEditAllowed) {
    throw new Error("Invalid fields in edit profile request");
  }
  return true;
};
const validatePassword = (req)=>{
  const {password} = req.body;
    return validator.isStrongPassword(password);
  };
module.exports = {
  validateSignupData,
  validateEditProfileData,
  validatePassword,
};
