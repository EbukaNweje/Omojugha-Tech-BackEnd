const Joi = require('@hapi/joi');

const myValidation = (req, res, next)=>{
  const validation = Joi.object({
    fullName: Joi.string().min(3).max(30).required().messages({
        'string.base': 'First name must be a string',
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least {#limit} characters long',
        'string.max': 'First name cannot be longer than {#limit} characters',
      }),
    email: Joi.string().email().required().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Invalid email address',
      }),
    password: Joi.string().required().min(8).max(30).messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be min of 8 characters',
        'string.max': 'Password must be max of 16 characters',
      }),
  
  });
  const {fullName, email,password} = req.body
  const {error} = validation.validate({fullName,email,password}, {abortEarly:false})
  if(error){
    return res.status(400).json({
      error:error.message
    })
  }
  next()
}

module.exports = myValidation