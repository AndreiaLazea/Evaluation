import React, { useState } from 'react';
import './CrudOperations.css';

const CrudOperations = () => {
  const [artist, setArtist] = useState({ name: '', albums: [] });
  const [album, setAlbum] = useState({ title: '', description: '', songs: [] });
  const [song, setSong] = useState({ title: '', length: '' });
  const [artistId, setArtistId] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [isAlbumEnabled, setIsAlbumEnabled] = useState(false);
  const [isSongEnabled, setIsSongEnabled] = useState(false);

  const handleArtistChange = (e) => {
    setArtist({ ...artist, [e.target.name]: e.target.value });
    setIsAlbumEnabled(e.target.value !== '');
  };

  const handleAlbumChange = (e) => {
    setAlbum({ ...album, [e.target.name]: e.target.value });
  };

  const handleSongChange = (e) => {
    setSong({ ...song, [e.target.name]: e.target.value });
  };

  const addArtist = async () => {
    if (artist.name) {
      try {
        const response = await fetch('http://localhost:5000/add-artist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(artist),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Artist added with ID:', data._id);  
        setIsAlbumEnabled(true);
      } catch (error) {
        console.error('Error adding artist:', error);
      }
    }
  };

  const addAlbum = async () => {
    console.log('Artist ID before adding album:', artistId);  
    if (album.title && album.description) {
      try {
        const response = await fetch(`http://localhost:5000/add-album/${artistId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(album),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Album added:', data);  
        const newAlbumId = data.albums[data.albums.length - 1]._id;
        setAlbumId(newAlbumId);
        setIsSongEnabled(true);
      } catch (error) {
        console.error('Error adding album:', error);
      }
    }
  };

  const addSong = async () => {
    if (song.title && song.length) {
      try {
        const response = await fetch(`http://localhost:5000/add-song/${artistId}/${albumId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(song),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setSong({ title: '', length: '' });
      } catch (error) {
        console.error('Error adding song:', error);
      }
    }
  };

  return (
    <div className="crud-operations">
      <h1>Music Database</h1>

      <div>
        <h2>Add Artist</h2>
        <input
          type="text"
          name="name"
          placeholder="Artist Name"
          value={artist.name}
          onChange={handleArtistChange}
        />
        <button onClick={addArtist}>Add Artist</button>
      </div>

      <div>
        <h2>Add Album</h2>
        <input
          type="text"
          name="title"
          placeholder="Album Title"
          value={album.title}
          onChange={handleAlbumChange}
          disabled={!isAlbumEnabled}
        />
        <input
          type="text"
          name="description"
          placeholder="Album Description"
          value={album.description}
          onChange={handleAlbumChange}
          disabled={!isAlbumEnabled}
        />
        <button onClick={addAlbum} disabled={!isAlbumEnabled}>Add Album</button>
      </div>

      <div>
        <h2>Add Song</h2>
        <input
          type="text"
          name="title"
          placeholder="Song Title"
          value={song.title}
          onChange={handleSongChange}
          disabled={!isSongEnabled}
        />
        <input
          type="text"
          name="length"
          placeholder="Song Length"
          value={song.length}
          onChange={handleSongChange}
          disabled={!isSongEnabled}
        />
        <button onClick={addSong} disabled={!isSongEnabled}>Add Song</button>
      </div>
    </div>
  );
};

export default CrudOperations;