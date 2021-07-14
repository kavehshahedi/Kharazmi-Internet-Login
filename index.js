const express = require('express');
const app = express();
const mongoose = require('mongoose');

const apiRoutes = require('./routes/api');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1', apiRoutes);

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_ADDRESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

app.listen(process.env.PORT, () => console.log('Server runnig on PORT: ' + process.env.PORT));