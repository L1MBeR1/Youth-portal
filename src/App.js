
import React,{useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout';

import Home from './pages/home';
import Login from './pages/login';
import Registration from './pages/registration';
import Recovery from './pages/recovery';

import {M} from './js/materialize';

import './css/materialize.css'
import './css/App.css'
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
        <Route path="/registration" element={<Registration />} />
        <Route path="/recovery" element={<Recovery />} />
      </Routes>
    </Layout>
  </Router>

  );
}

export default App;
