const Joi = require('@hapi/joi');

const myValidation = (req, res, next)=>{
  const validation = Joi.object({
    fullName: Joi.string().min(6).max(60).trim().required().regex(/^[a-zA-Z]+ [a-zA-Z]+$/)
        .messages({
            'string.empty': "Full name field can't be left empty",
            'string.min': "Minimum of 6 characters for the full name field",
            'any.required': "Please full name is required",
            'string.pattern.base': "Please provide both first and last names separated by a space"
        }),

    email: Joi.string().max(40).trim().email({ tlds: { allow: false } }).required()
    .messages({
        'string.empty': "Email field can't be left empty",
        'any.required': "Please Email is required"
    }),

    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character, and must be at least 8 characters long',
            'string.empty': 'Password cannot be empty',
            'string.min': 'Minimum 8 characters required',
            'any.required': 'Password is required',
            //  "string.pattern.base": "Empty space not allowed"
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