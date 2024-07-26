const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), required: true }, 
  title: { type: String, required: true },
  length: { type: String, required: true }
});

const AlbumSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), required: true }, 
  title: { type: String, required: true },
  description: { type: String, required: true },
  songs: [SongSchema]
});

const ArtistSchema = new Schema({
  name: { type: String, required: true },
  albums: [AlbumSchema]
});

const Artist = mongoose.model('Artist', ArtistSchema, 'Data');

module.exports = {
  Artist
};