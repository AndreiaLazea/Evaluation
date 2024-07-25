const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  title: { type: String, required: true },
  length: { type: String, required: true }
});

const AlbumSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  songs: [SongSchema]
});

const ArtistSchema = new Schema({
  name: { type: String, required: true },
  albums: [AlbumSchema]
});
const Artist = mongoose.model('Artist', ArtistSchema, 'Data');
const Song = mongoose.model('Song', SongSchema, 'Data');
const Album = mongoose.model('Album', AlbumSchema, 'Data');

module.exports = Artist;