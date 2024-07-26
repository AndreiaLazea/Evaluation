const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Data = require('./models/Data');
const { Artist } = require('./models/Data');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/AssessmentDB';

mongoose.connect(mongoDB)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

    app.get('/api/data/display', async (req, res) => {
        try {
            const artists = await Artist.find();
            res.json(artists);
        } catch (error) {
            console.error('Error fetching artists:', error);
            res.status(500).json({ message: error.message });
        }
    });
    
    
    app.put('/update-artist/:artistId', async (req, res) => {
        try {
            const { artistId } = req.params;
            const updateData = req.body;
    
            const artist = await Artist.findByIdAndUpdate(artistId, updateData, { new: true });
            if (!artist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
            res.json(artist);
        } catch (error) {
            console.error('Error updating artist:', error);
            res.status(500).json({ message: error.message });
        }
    });
    
    app.put('/update-album/:artistId/:albumName', async (req, res) => {
        try {
            const { artistId, albumName } = req.params;
            const updateData = req.body;
    
            const artist = await Artist.findById(artistId);
            if (!artist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
    
            const album = artist.albums.find(album => album.title === albumName);
            if (!album) {
                return res.status(404).json({ message: 'Album not found' });
            }
    
            album.title = updateData.title || album.title;
            album.description = updateData.description || album.description;
    
            await artist.save();
            res.json(album);
        } catch (error) {
            console.error('Error updating album:', error);
            res.status(500).json({ message: error.message });
        }
    });
    
    app.put('/update-song/:artistId/:albumName/:songName', async (req, res) => {
        try {
            const { artistId, albumName, songName } = req.params;
            const updateData = req.body;
    
            const artist = await Artist.findById(artistId);
            if (!artist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
    
            const album = artist.albums.find(album => album.title === albumName);
            if (!album) {
                return res.status(404).json({ message: 'Album not found' });
            }
    
            const song = album.songs.find(song => song.title === songName);
            if (!song) {
                return res.status(404).json({ message: 'Song not found' });
            }
    
            song.title = updateData.title || song.title;
            song.length = updateData.length || song.length;
    
            await artist.save();
            res.json(song);
        } catch (error) {
            console.error('Error updating song:', error);
            res.status(500).json({ message: error.message });
        }
    });

    app.delete('/delete-artist/:artistId', async (req, res) => {
        try {
            const { artistId } = req.params;
            const artist = await Artist.findByIdAndDelete(artistId);
            if (!artist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
            res.json({ message: 'Artist deleted successfully' });
        } catch (error) {
            console.error('Error deleting artist:', error);
            res.status(500).json({ message: error.message });
        }
    });
    
    app.delete('/delete-album/:artistId/:albumName', async (req, res) => {
        try {
            const { artistId, albumName } = req.params;
            console.log(`Deleting album with artistId: ${artistId}, albumName: ${albumName}`);
    
            const artist = await Artist.findById(artistId);
            if (!artist) {
                console.log('Artist not found');
                return res.status(404).json({ message: 'Artist not found' });
            }
    
            const album = artist.albums.find(album => album.title === albumName);
            if (!album) {
                console.log('Album not found');
                return res.status(404).json({ message: 'Album not found' });
            }
    
            artist.albums = artist.albums.filter(album => album._id.toString() !== album._id.toString()); // Remove album by filtering
            await artist.save();
            res.json({ message: 'Album deleted successfully' });
        } catch (error) {
            console.error('Error deleting album:', error);
            res.status(500).json({ message: error.message });
        }
    });
    
    app.delete('/delete-song/:artistId/:albumName/:songName', async (req, res) => {
        try {
            const { artistId, albumName, songName } = req.params;
            console.log(`Deleting song with artistId: ${artistId}, albumName: ${albumName}, songName: ${songName}`);
    
            const artist = await Artist.findById(artistId);
            if (!artist) {
                console.log('Artist not found');
                return res.status(404).json({ message: 'Artist not found' });
            }
    
            const album = artist.albums.find(album => album.title === albumName);
            if (!album) {
                console.log('Album not found');
                return res.status(404).json({ message: 'Album not found' });
            }
    
            album.songs = album.songs.filter(song => song.title !== songName); // Remove song by filtering
            await artist.save();
            res.json({ message: 'Song deleted successfully' });
        } catch (error) {
            console.error('Error deleting song:', error);
            res.status(500).json({ message: error.message });
        }
    });

    app.post('/create-artist', async (req, res) => {
        try {
            const { name } = req.body;
            const newArtist = new Artist({ name, albums: [] });
            await newArtist.save();
            res.json(newArtist);
        } catch (error) {
            console.error('Error creating artist:', error);
            res.status(500).json({ message: error.message });
        }
    });
    
    app.post('/create-album/:artistId', async (req, res) => {
        try {
            const { artistId } = req.params;
            const { title, description } = req.body;
            const artist = await Artist.findById(artistId);
            if (!artist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
            const newAlbum = { _id: new mongoose.Types.ObjectId(), title, description, songs: [] };
            artist.albums.push(newAlbum);
            await artist.save();
            res.json(newAlbum);
        } catch (error) {
            console.error('Error creating album:', error);
            res.status(500).json({ message: error.message });
        }
    });
    
    app.post('/create-song/:artistId/:albumId', async (req, res) => {
        try {
            const { artistId, albumId } = req.params;
            const { title, length } = req.body;
            const artist = await Artist.findById(artistId);
            if (!artist) {
                return res.status(404).json({ message: 'Artist not found' });
            }
            const album = artist.albums.id(albumId);
            if (!album) {
                return res.status(404).json({ message: 'Album not found' });
            }
            const newSong = { _id: new mongoose.Types.ObjectId(), title, length };
            album.songs.push(newSong);
            await artist.save();
            res.json(newSong);
        } catch (error) {
            console.error('Error creating song:', error);
            res.status(500).json({ message: error.message });
        }
    });
    
    
app.use((req, res, next) => {
    res.status(404).send('Sorry, that route does not exist.');
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});