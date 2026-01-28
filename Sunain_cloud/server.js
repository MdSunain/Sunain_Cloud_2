const express = require('express');
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const uploadRoute = require("./routes/upload.routes")
const authMiddleware = require("./middleware/auth.middleware");
const File = require('./models/File') 
const downloadRoute = require('./routes/download.routes')
const viewRoute = require('./routes/view.routes');
const deleteRoute = require('./routes/delete.routes');
const shareRoute = require('./routes/share.routes');
const publicRoute = require('./routes/public.route');

const app = express()
connectDB();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(authRoutes);
app.use(uploadRoute);
app.use(downloadRoute);
app.use(viewRoute);
app.use(deleteRoute);
app.use(shareRoute);
app.use(publicRoute);

// Base Template
app.get('/', (req,res)=>{
    res.send('Hello world')
})

// login page
app.get('/login', (req,res)=>{
    res.render('login')
})
// Register page
app.get('/register', (req,res)=>{
    res.render('register')
})
// Home page (protected)
app.get('/home', authMiddleware, async (req, res)=>{
    try{
        const file = await File.find({userId: req.user.id}).sort({ createdAt: -1 })
        res.render('home', {user: req.user, file, uploaded: req.query.uploaded})
    }
    catch(err){
        console.error(err);
        res.status(500).send("Failed to load files");
    }
    // res.render('home', { user: req.user })
})

// Upload Page (Protected)
app.get('/upload',authMiddleware, (req,res)=>{
    res.render('upload')
})

// view

app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})