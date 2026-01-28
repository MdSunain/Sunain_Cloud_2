// authentication routes
const express = require('express')
const  bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require("../models/User");
const router = express.Router()

// REGISTER
router.post('/register', async (req,res)=>{
    const { username, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
 
    await User.create({
        username,
        email,
        password: hash
    })

    res.redirect('/login');
    console.log('User Registered');
    console.log(username, email, password)

})//User Registered : Sunain mdsunain218@gmail.com Assassed123#

// LOGIN
router.post('/login', async(req, res)=>{
    const { email, password} = req.body;

    const user = await User.findOne({ email});
    if(!user){ 
        console.log('User not found');
        return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch){

        console.log('Password does not match');
        return res.redirect('/login');

    }

    const token = jwt.sign(
    { 
        id: user._id, 
    },
    "shhhhhh",
    { expiresIn: "30m" }
  );

  res.cookie('token',token,{
    httpOnly: true,
  })

  res.redirect('/home')
  
})

// LOGOUT
router.get('/logout', (req,res)=>{
    res.clearCookie('token');
    res.redirect('/login')

})

module.exports = router;


