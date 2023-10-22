/*import React from 'react'
import Login from './Login'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Signup from './Signup'
import Home from './Home'
import Zdarzenia from './Zdarzenia'



function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/home' element={<Home/>}></Route>
          <Route path="/zdarzenia" element={<Zdarzenia />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
*/

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Zdarzenia from './Zdarzenia';
import Admin from './admin';

const App = () => {
  // Pobierz token z ciastka
  const token = document.cookie.split('; ').find(row => row.startsWith('token='));

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/home" /> : <Signup />}
        />
        <Route
          path="/home"
          element={token ? <Home /> : <Navigate to="/" />} // Przekieruj do strony logowania, jeśli brak tokenu
        />
        <Route 
        path="/zdarzenia" element={<Zdarzenia />} 
        />

        <Route 
        path="/admin" element={<Admin />} 
        />
      </Routes>
        
      
    </BrowserRouter>
  );
};

export default App;
