import React, { useEffect, useState } from 'react';
import './DataList.css';

const API_URL = 'http://localhost:5000';

const DataList = () => {
  const [data, setData] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});

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

  const handleUpdateClick = (item, type) => {
    setCurrentItem({ ...item, type });
    setFormData({ ...item });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const { type, artistId, _id, title, name } = currentItem;
    let url;
    let body;

    if (type === 'artist') {
      url = `${API_URL}/update-artist/${_id}`;
      body = { name: formData.name };
    } else if (type === 'album') {
      url = `${API_URL}/update-album/${artistId}/${title}`;
      body = { title: formData.title, description: formData.description };
    } else if (type === 'song') {
      url = `${API_URL}/update-song/${artistId}/${currentItem.albumTitle}/${title}`;
      body = { title: formData.title, length: formData.length };
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      await fetchData();
      setCurrentItem(null);
    } catch (error) {
      console.error('Error updating item:', error.message);
    }
  };

  return (
    <div className="data-list">
      <h1>Data</h1>
      {data.length > 0 ? (
        data.map((artist) => (
          <div key={artist._id} className="data-item">
            <h2>{artist.name}</h2>
            <button onClick={() => handleUpdateClick(artist, 'artist')}>Update Artist</button>
            {artist.albums.map((album) => (
              <div key={album._id} className="album-item">
                <h3>{album.title}</h3>
                <p>{album.description}</p>
                <button onClick={() => handleUpdateClick({ ...album, artistId: artist._id }, 'album')}>Update Album</button>
                <ul>
                  {album.songs.map((song) => (
                    <li key={song._id}>
                      <strong>{song.title}</strong> - {song.length}
                      <button onClick={() => handleUpdateClick({ ...song, artistId: artist._id, albumTitle: album.title }, 'song')}>Update Song</button>
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

      {currentItem && (
        <form onSubmit={handleUpdateSubmit}>
          <h2>Update {currentItem.type}</h2>
          {currentItem.type === 'artist' && (
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="Artist Name"
            />
          )}
          {currentItem.type === 'album' && (
            <>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                placeholder="Album Title"
              />
              <input
                type="text"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Album Description"
              />
            </>
          )}
          {currentItem.type === 'song' && (
            <>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                placeholder="Song Title"
              />
              <input
                type="text"
                name="length"
                value={formData.length || ''}
                onChange={handleInputChange}
                placeholder="Song Length"
              />
            </>
          )}
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};

export default DataList;