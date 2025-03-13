import React, { useState } from 'react'
import { NavBar } from './components/nav/NavBar'
import { Footer } from './components/footer/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { Home } from './components/homePage/Home'

function App() {
  return (
    <div className="app">
      <Router>
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
        <Footer className="custom-footer" />
      </Router>
    </div>
  )
}

export default App
/*      <Routes>
<Route path="/" element={<Home />} />
</Routes> */
