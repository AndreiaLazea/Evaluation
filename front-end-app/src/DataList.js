import React, { useEffect, useState } from 'react';

const DataList = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = () => {
    fetch('http://localhost:5000/api/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };
  return (
    <div>
      <h1>Data</h1>
      {data.map(item => (
        <div key={item._id}>
          <h2>{item.name}</h2>
          {item.albums.map(album => (
            <div key={album._id}>
              <h3>{album.title}</h3>
              <p>{album.description}</p>
              <ul>
                {album.songs.map(song => (
                  <li key={song._id}>{song.title} - {song.length}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DataList;