require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err))

app.use('/users', require('./routes/users'))
app.use('/patients', require('./routes/patients'))
app.use('/radiology', require('./routes/radiology'));
app.use('/radiologyresult', require('./routes/radiologyInterface'));
app.use('/referrals', require('./routes/referrals'));
app.use('/treatments', require('./routes/treatments'));

//app.use('/ward', wardRoutes);
//app.use('/lab', require('./routes/labRoutes'));
//app.use('/api/labs', diagonsticlabRoutes);




app.listen(3000, () => console.log('Server running on port 3000'))
