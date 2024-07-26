import React, { useState } from 'react';

const API_URL = 'http://localhost:5000';

const CreateComponent = ({ fetchData }) => {
  const [artistName, setArtistName] = useState('');
  const [albumDetails, setAlbumDetails] = useState({ artistId: '', title: '', description: '' });
  const [songDetails, setSongDetails] = useState({ artistId: '', albumId: '', title: '', length: '' });

  const handleCreateArtist = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/create-artist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: artistName, albums: [] }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      setArtistName('');
      fetchData();
    } catch (error) {
      console.error('Error creating artist:', error.message);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/create-album/${albumDetails.artistId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: albumDetails.title, description: albumDetails.description, songs: [] }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      setAlbumDetails({ artistId: '', title: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating album:', error.message);
    }
  };

  const handleCreateSong = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/create-song/${songDetails.artistId}/${songDetails.albumId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: songDetails.title, length: songDetails.length }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      setSongDetails({ artistId: '', albumId: '', title: '', length: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating song:', error.message);
    }
  };

  return (
    <div className="create-component">
      <h2>Create Artist</h2>
      <form onSubmit={handleCreateArtist}>
        <input
          type="text"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Artist Name"
          required
        />
        <button type="submit">Create Artist</button>
      </form>

      <h2>Create Album</h2>
      <form onSubmit={handleCreateAlbum}>
        <input
          type="text"
          value={albumDetails.artistId}
          onChange={(e) => setAlbumDetails({ ...albumDetails, artistId: e.target.value })}
          placeholder="Artist ID"
          required
        />
        <input
          type="text"
          value={albumDetails.title}
          onChange={(e) => setAlbumDetails({ ...albumDetails, title: e.target.value })}
          placeholder="Album Title"
          required
        />
        <input
          type="text"
          value={albumDetails.description}
          onChange={(e) => setAlbumDetails({ ...albumDetails, description: e.target.value })}
          placeholder="Album Description"
          required
        />
        <button type="submit">Create Album</button>
      </form>

      <h2>Create Song</h2>
      <form onSubmit={handleCreateSong}>
        <input
          type="text"
          value={songDetails.artistId}
          onChange={(e) => setSongDetails({ ...songDetails, artistId: e.target.value })}
          placeholder="Artist ID"
          required
        />
        <input
          type="text"
          value={songDetails.albumId}
          onChange={(e) => setSongDetails({ ...songDetails, albumId: e.target.value })}
          placeholder="Album ID"
          required
        />
        <input
          type="text"
          value={songDetails.title}
          onChange={(e) => setSongDetails({ ...songDetails, title: e.target.value })}
          placeholder="Song Title"
          required
        />
        <input
          type="text"
          value={songDetails.length}
          onChange={(e) => setSongDetails({ ...songDetails, length: e.target.value })}
          placeholder="Song Length"
          required
        />
        <button type="submit">Create Song</button>
      </form>
    </div>
  );
};

export default CreateComponent;