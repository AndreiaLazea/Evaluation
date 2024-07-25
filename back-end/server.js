const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Data = require('./models/Data');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const mongoDB = 'mongodb://localhost:27017/AssessmentDB';

mongoose.connect(mongoDB)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

    app.get('/api/data/display', async (req, res) => {
        try {
            const data = await Data.find();
            res.json(data);
        } catch (err) {
            res.status(500).send(err);
        }
    });
    
    app.get('/api/data', async (req, res) => {
        try {
            const data = await Data.find();
            res.json(data);
        } catch (err) {
            res.status(500).send(err);
        }
    });
    
    app.post('/api/data', async (req, res) => {
        const newData = new Data(req.body);
        try {
            const savedData = await newData.save();
            res.status(201).json(savedData);
        } catch (err) {
            res.status(400).send(err);
        }
    });
    
    app.post('/update-artist/:id', async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
    
        try {
            const updatedArtist = await Artist.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
            if (!updatedArtist) {
                return res.status(404).send('Artist not found');
            }
            res.status(200).send(updatedArtist);
        } catch (error) {
            console.error('Failed to update artist:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    
    // Update Album
    app.post('/update-album/:artistId/:albumId', async (req, res) => {
        const { artistId, albumId } = req.params;
        const { title, description } = req.body;
    
        try {
            const artist = await Artist.findById(artistId);
            if (!artist) {
                return res.status(404).send('Artist not found');
            }
    
            const album = artist.albums.id(albumId);
            if (!album) {
                return res.status(404).send('Album not found');
            }
    
            album.title = title;
            album.description = description;
            await artist.save();
    
            res.status(200).send(artist);
        } catch (error) {
            console.error('Failed to update album:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    
    // Update Song
    app.post('/update-song/:artistId/:albumId/:songId', async (req, res) => {
        const { artistId, albumId, songId } = req.params;
        const { title, length } = req.body;
    
        try {
            const artist = await Artist.findById(artistId);
            if (!artist) {
                return res.status(404).send('Artist not found');
            }
    
            const album = artist.albums.id(albumId);
            if (!album) {
                return res.status(404).send('Album not found');
            }
    
            const song = album.songs.id(songId);
            if (!song) {
                return res.status(404).send('Song not found');
            }
    
            song.title = title;
            song.length = length;
            await artist.save();
    
            res.status(200).send(artist);
        } catch (error) {
            console.error('Failed to update song:', error);
            res.status(500).send('Internal Server Error');
        }
    });

app.use((req, res, next) => {
    res.status(404).send('Sorry, that route does not exist.');
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});