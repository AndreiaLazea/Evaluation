const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const mongoDB = 'mongodb://localhost:27017/AssessmentDB';

mongoose.connect(mongoDB)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/api/data', async (req, res) => {
    try {
        console.log('Fetching data from MongoDB...');
        const data = await Data.find();
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err); 
        res.status(500).send(err);
    }
});

app.use((req, res, next) => {
    res.status(404).send('Sorry, that route does not exist.');
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});