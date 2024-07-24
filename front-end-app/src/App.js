import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DataList from './DataList'; 


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DataList />} />
      </Routes>
    </Router>
  );
};
export default App;