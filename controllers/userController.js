const userModel = require("../models/userModel")
require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.signUp = async (req, res) => {
    try {
        // get the requirement for the registration
        const {fullName, email, password, confirmPassword} = req.body
        //check if email already exist
        const emailExist = await userModel.findOne({email})
        if (emailExist) {
            return res.status(400).json({
                message: "This user already exist"
            })
        }
        if (confirmPassword != password) {
            return res.status(400).json({
                message: "Password does not match"
            })
        }

        const salt = bcrypt.genSaltSync(12)
        const hash = bcrypt.hashSync(password, salt)

        const fullNameParts = fullName.split(' ');
        const firstName = fullNameParts[0];
        const lastNameInitial = fullNameParts.slice(-1)[0][0];
        
        const user = await userModel.create({
            fullName:fullName.toLowerCase(),
            email: email.toLowerCase(),
            password: hash,
            confirmPassword: hash
        })

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            fullName: user.fullName
        }, process.env.jwtSecret, { expiresIn : "60"})

        // send verification email to the user
        //     const name = `${user.fullName.toUpperCase()} . ${user.lastName.slice(0,1).toUpperCase()}`
        //     const link = `${req.protocol}://${req.get('host')}/verify-user/${user.id}/${token}`
        //     const html = dynamicHtml(link, name)
        //     sendEmail({
        //     email: user.email,
        //     subject: "Click on the button below to verify your email", 
        //     html
        // })
        //failure mssg
        if (!user) {
            return res.status(400).json({
                message: "Error creating your account"
            })
        }

        res.status(200).json({
            message: `Hello, Your Account Has Been Successfully Created`,
            data: user
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.verifyUser = async (req,res)=>{
    try{
       
          const  id = req.params.id
          const token = req.params.token
          
          await jwt.verify(token, process.env.JWT_KEY )

       const updatedUser = await userModel.findByIdAndUpdate(id, {isVerified: true}, {new: true})
       res.redirect ("https://")

   
       res.status(200).json({
           message:`user with emmail:${updatedUser.email} is now verified`,
           data: updatedUser
       })
    }catch(err){
       res.status(500).json({
           error: err.message
       })
    } 
   }


exports.logIn = async (req, res) => {
    try {
        ////Get the data from the request body
        const {email, password} = req.body

        //check if user exist already
        const userExist = await userModel.findOne({email: email.toLowerCase()})
        if (!userExist) {
            return res.status(404).json({
                message: "Email does not exist"
            })
        }

        //check password
        const checkPassword = bcrypt.compareSync(password, userExist.password)
        if (!checkPassword) {
            return res.status(404).json({
                message: "Incorrect Password"
            })
        }
        // generate a token
        const token = jwt.sign({
            userId: userExist._id,
            email: userExist.email,
            fullName: userExist.fullName
        }, process.env.jwtSecret, { expiresIn : "2d"})

        //success msg
        res.status(200).json({
           message: "Successfully Logged in" ,
           token
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getOneUser = async (req, res) =>{
    try{
        const userId = req.user.userId
        console.log(userId)
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({
                error: `User not found`
            })
        }

        res.status(200).json({
            message: `User found ${user.firstName}`,
            data: user
        })

    }catch(error){
        res.status(500).json({
            message: `Internal server error: ${error.message}`
        })
    }
}

exports.reverifyUser = async (req, res) =>{
    try{
        const {email} = req.body
        const newUser = await userModel.findOne({email})
        if(!newUser){
            return res.status(404).json({
                message: `User with email: ${newUser.email} does not exists`
            })
        }       
         // generate a token for the user 
         const token = jwt.sign({
            userId:newUser._id,
            email:newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName 
        },process.env.JWT_KEY,{expiresIn:"6000s"})

        // send verification email to the user
            const name = `${newUser.firstName.toUpperCase()} . ${newUser.lastName.slice(0,1).toUpperCase()}`
            const link = `${req.protocol}://${req.get('host')}/verify-user/${newUser.id}/${token}`
            const html = dynamicHtml(link, name)
            sendEmail({
            email:newUser.email,
            subject:"Click on the button below to verify your email", 
            html
            })
    }
    catch(error){
        res.status(500).json({
            message: `Internal error message: ${error.message}`
        })
    }
}

exports.signOut = async (req, res) => {
    try {
        const token = req.headers.authorization.spilt(' ')[1]
        if (!token) {
            return res.status(404).json({
                message: "Authorization failed: token not found"
            })
        } 
        //get user id
        const userId = req.user.userId

        //find user
        const user = await userModel.findById(userId)

        //push the user to blacklist and save
        user.blackList.push(token)

        //save user
        await user.save()

        //show success
        res.status(200).json({
            message: "You have logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.forgotPassword = async (req, res) => {
    try {
        const checkUser = await userModel.findOne({email: req.body.email})
        if (!checkUser) {
            return res.status(404).json({
                message: "Email does not exist"
            })
        }
        else {
            const name = checkUser.firstName + ' ' + checkUser.lastName
            const subject = 'Kindly reset your password'
            const link = `http://localhost:${port}/user-reset/${checkUser.id}`
            const html = resetFunc(name, link)
            sendEmail({
                email: checkUser.email,
                html,
                subject
            })
            return res.status(200).json({
                message: "Kindly check your email to reset your password",
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        //get id from params
        const id = req.params.id;
        //get data from body
        const password = req.body.password;
        //check if password exist
        if (!password) {
            return res.status(404).json({
                message: "Passwprd cannot be empty"
            })
        }

        const saltPass = bcrypt.genSaltSync(12);
        const hashPass = bcrypt.hashSync(password, saltPass);

        const resetPass = await userModel.findByIdAndUpdate(id, { password: hashPass }, { new: true });
        
        //success
        return res.status(200).json({
            message: "Password reset Successfully",
            resetPass
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}