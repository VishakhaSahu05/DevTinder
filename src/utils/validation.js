const validator = require ("validator");

const validateSignupData = (req)=>{
    const {firstName , LastName , emailId , password , age , gender , photoUrl} = req.body;
    if(!firstName || !LastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email address is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password");
    }
};
module.exports = {
  validateSignupData,
}