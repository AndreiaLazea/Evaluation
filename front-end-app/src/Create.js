import React, { useEffect, useState } from 'react';
import './DataList.css';

const API_URL = 'http://localhost:5000';

const DataList = () => {
  const [data, setData] = useState([]);
  const [newArtistName, setNewArtistName] = useState('');
  const [newAlbumData, setNewAlbumData] = useState({ artistId: '', title: '', description: '' });
  const [newSongData, setNewSongData] = useState({ artistId: '', albumId: '', title: '', length: '' });

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/data/display`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateArtist = async () => {
    try {
      const response = await fetch(`${API_URL}/create-artist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newArtistName }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      await fetchData();
      setNewArtistName('');
    } catch (error) {
      console.error('Error creating artist:', error.message);
    }
  };

  const handleCreateAlbum = async () => {
    try {
      const response = await fetch(`${API_URL}/create-album/${newAlbumData.artistId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newAlbumData.title, description: newAlbumData.description }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      await fetchData();
      setNewAlbumData({ artistId: '', title: '', description: '' });
    } catch (error) {
      console.error('Error creating album:', error.message);
    }
  };

  const handleCreateSong = async () => {
    try {
      const response = await fetch(`${API_URL}/create-song/${newSongData.artistId}/${newSongData.albumId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newSongData.title, length: newSongData.length }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      await fetchData();
      setNewSongData({ artistId: '', albumId: '', title: '', length: '' });
    } catch (error) {
      console.error('Error creating song:', error.message);
    }
  };

  return (
    <div className="data-list">
      <h1>Data</h1>
      <div>
        <h2>Create Artist</h2>
        <input
          type="text"
          value={newArtistName}
          onChange={(e) => setNewArtistName(e.target.value)}
          placeholder="Artist Name"
        />
        <button onClick={handleCreateArtist}>Create Artist</button>
      </div>
      <div>
        <h2>Create Album</h2>
        <select
          value={newAlbumData.artistId}
          onChange={(e) => setNewAlbumData({ ...newAlbumData, artistId: e.target.value })}
        >
          <option value="">Select Artist</option>
          {data.map((artist) => (
            <option key={artist._id} value={artist._id}>
              {artist.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newAlbumData.title}
          onChange={(e) => setNewAlbumData({ ...newAlbumData, title: e.target.value })}
          placeholder="Album Title"
        />
        <input
          type="text"
          value={newAlbumData.description}
          onChange={(e) => setNewAlbumData({ ...newAlbumData, description: e.target.value })}
          placeholder="Album Description"
        />
        <button onClick={handleCreateAlbum} disabled={!newAlbumData.artistId}>Create Album</button>
      </div>
      <div>
        <h2>Create Song</h2>
        <select
          value={newSongData.artistId}
          onChange={(e) => setNewSongData({ ...newSongData, artistId: e.target.value })}
        >
          <option value="">Select Artist</option>
          {data.map((artist) => (
            <option key={artist._id} value={artist._id}>
              {artist.name}
            </option>
          ))}
        </select>
        <select
          value={newSongData.albumId}
          onChange={(e) => setNewSongData({ ...newSongData, albumId: e.target.value })}
          disabled={!newSongData.artistId}
        >
          <option value="">Select Album</option>
          {newSongData.artistId &&
            data
              .find((artist) => artist._id === newSongData.artistId)
              ?.albums.map((album) => (
                <option key={album._id} value={album._id}>
                  {album.title}
                </option>
              ))}
        </select>
        <input
          type="text"
          value={newSongData.title}
          onChange={(e) => setNewSongData({ ...newSongData, title: e.target.value })}
          placeholder="Song Title"
        />
        <input
          type="text"
          value={newSongData.length}
          onChange={(e) => setNewSongData({ ...newSongData, length: e.target.value })}
          placeholder="Song Length"
        />
        <button onClick={handleCreateSong} disabled={!newSongData.artistId || !newSongData.albumId}>
          Create Song
        </button>
      </div>

      {data.length > 0 ? (
        data.map((artist) => (
          <div key={artist._id} className="data-item">
            <h2>{artist.name}</h2>
            {artist.albums.map((album) => (
              <div key={album._id} className="album-item">
                <h3>{album.title}</h3>
                <p>{album.description}</p>
                <ul>
                  {album.songs.map((song) => (
                    <li key={song._id}>
                      <strong>{song.title}</strong> - {song.length}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default DataList;