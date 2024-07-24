import React, { useEffect, useState } from 'react';
import './DataList.css'; 

const DataList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/data');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="data-list">
      <h1>Data Overview</h1>
      {data.length > 0 ? (
        data.map(item => (
          <div key={item._id} className="data-item">
            <h2>{item.name}</h2>
            {item.albums.map(album => (
              <div key={album._id} className="album-item">
                <h3>{album.title}</h3>
                <p>{album.description}</p>
                <ul>
                  {album.songs.map(song => (
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