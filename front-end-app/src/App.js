import React from 'react';
import DataList from './DataList';
import Update from './Update'; 
import Search from './Search'; 
import Create from './Create'; 
import Delete from './Delete'; 

function App() {
  const path = window.location.pathname;

  return (
    <div className="App">
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/create">Create</a></li>
          <li><a href="/data">Read</a></li>
          <li><a href="/update">Update</a></li> 
          <li><a href="/delete">Update</a></li> 
          <li><a href="/search">Search</a></li> 

        </ul>
      </nav>
      {path === '/create' && <Create />}
      {path === '/data' && <DataList />}
      {path === '/update' && <Update />} 
      {path === '/delete' && <Delete />} 
      {path === '/search' && <Search />} 
      {path === '/' && <h1>Welcome to the App</h1>}
    </div>
  );
}

export default App;