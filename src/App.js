
import React,{useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';

import Home from './pages/home';
import Login from './pages/login';

import {M} from './js/materialize';

import './css/materialize.css'
function App() {
  useEffect(() => {
    M.AutoInit();
  },[])

  return (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Layout>
  </Router>

  );
}

export default App;
