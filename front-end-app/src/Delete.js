import React, { useEffect, useState } from 'react';
import './DataList.css';

const API_URL = 'http://localhost:5000';

const DataList = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/data/display`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const data = await response.json();
      console.log('Fetched data:', data); // Log the data to verify
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = async (item, type) => {
    let url;
    if (type === 'artist') {
      url = `${API_URL}/delete-artist/${item._id}`;
      console.log(`Deleting artist with ID: ${item._id}`); // Log the artist ID
    } else if (type === 'album') {
      url = `${API_URL}/delete-album/${item.artistId}/${item.title}`;
      console.log(`Deleting album with title: ${item.title}, Artist ID: ${item.artistId}`); // Log the album and artist IDs
    } else if (type === 'song') {
      url = `${API_URL}/delete-song/${item.artistId}/${item.albumTitle}/${item.title}`;
      console.log(`Deleting song with title: ${item.title}, Album title: ${item.albumTitle}, Artist ID: ${item.artistId}`); // Log the song, album, and artist IDs
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      await fetchData(); // Refresh data after deletion
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  return (
    <div className="data-list">
      <h1>Data</h1>
      {data.length > 0 ? (
        data.map((artist) => (
          <div key={artist._id} className="data-item">
            <h2>{artist.name}</h2>
            <button onClick={() => handleDeleteClick(artist, 'artist')}>Delete Artist</button>
            {artist.albums.map((album) => (
              <div key={album._id} className="album-item">
                <h3>{album.title}</h3>
                <p>{album.description}</p>
                <button onClick={() => handleDeleteClick({ ...album, artistId: artist._id }, 'album')}>Delete Album</button>
                <ul>
                  {album.songs.map((song) => (
                    <li key={song._id}>
                      <strong>{song.title}</strong> - {song.length}
                      <button onClick={() => handleDeleteClick({ ...song, artistId: artist._id, albumTitle: album.title }, 'song')}>Delete Song</button>
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