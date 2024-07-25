import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000';

// Fetch all data
const fetchData = async () => {
    const response = await fetch(`${API_URL}/api/data/display`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    return response.json();
};

const checkResponse = (xhr) => {
    if (xhr.status === 404) {
        const error = JSON.parse(xhr.responseText);
        throw new Error(error.message || 'Not Found');
    }
    if (xhr.status !== 200) {
        const error = JSON.parse(xhr.responseText);
        throw new Error(error.message || 'Error');
    }
    return JSON.parse(xhr.responseText);
};

// Update artist
const updateArtist = (artistId, artist) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/update-artist/${artistId}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = () => {
            try {
                const response = checkResponse(xhr);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        };

        xhr.onerror = () => reject(new Error('Network error'));

        xhr.send(JSON.stringify(artist));
    });
};

// Update album
const updateAlbum = (artistId, albumId, album) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/update-album/${artistId}/${albumId}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = () => {
            try {
                const response = checkResponse(xhr);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        };

        xhr.onerror = () => reject(new Error('Network error'));

        xhr.send(JSON.stringify(album));
    });
};

// Update song
const updateSong = (artistId, albumId, songId, song) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_URL}/update-song/${artistId}/${albumId}/${songId}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = () => {
            try {
                const response = checkResponse(xhr);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        };

        xhr.onerror = () => reject(new Error('Network error'));

        xhr.send(JSON.stringify(song));
    });
};

const UpdateComponent = () => {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const getData = async () => {
            try {
                const fetchedData = await fetchData();
                setData(fetchedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getData();
    }, []);

    const handleDeleteClick = (item) => {
        setCurrentItem(item);
        setFormData({ ...item });
        setShowForm(true);
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
        try {
            if (currentItem.type === 'artist') {
                await updateArtist(currentItem._id, formData);
            } else if (currentItem.type === 'album') {
                await updateAlbum(currentItem.artistId, currentItem._id, formData);
            } else if (currentItem.type === 'song') {
                await updateSong(currentItem.artistId, currentItem.albumId, currentItem._id, formData);
            }
            const fetchedData = await fetchData();
            setData(fetchedData);
            setShowForm(false);
            setCurrentItem(null);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    return (
        <div>
            <h1>Data</h1>
            {data.length > 0 ? (
                data.map(artist => (
                    <div key={artist._id} className="data-item">
                        <h2>{artist.name}</h2>
                        <button onClick={() => handleDeleteClick({ ...artist, type: 'artist' })}>Delete Artist</button>
                        {artist.albums.map(album => (
                            <div key={album._id} className="album-item">
                                <h3>{album.title}</h3>
                                <p>{album.description}</p>
                                <button onClick={() => handleDeleteClick({ ...album, artistId: artist._id, type: 'album' })}>Delete Album</button>
                                <ul>
                                    {album.songs.map(song => (
                                        <li key={song._id}>
                                            <strong>{song.title}</strong> - {song.length}
                                            <button onClick={() => handleDeleteClick({ ...song, artistId: artist._id, albumId: album._id, type: 'song' })}>Delete Song</button>
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

            {showForm && (
                <form onSubmit={handleUpdateSubmit}>
                    <h2>Update Item</h2>
                    {formData.name !== undefined && (
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Name"
                        />
                    )}
                    {formData.title !== undefined && (
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Title"
                        />
                    )}
                    {formData.description !== undefined && (
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                        />
                    )}
                    {formData.length !== undefined && (
                        <input
                            type="text"
                            name="length"
                            value={formData.length}
                            onChange={handleInputChange}
                            placeholder="Length"
                        />
                    )}
                    <button type="submit">Save</button>
                </form>
            )}
        </div>
    );
};

export default UpdateComponent;