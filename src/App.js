import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/js/Login/Login';
import Home from './components/js/Home/Home';
import Lms from './components/js/LMS/LMS';
import Profile from './components/js/Profile/Profile';
import Tasks from './components/js/Tasks/Task';
import Portal from './components/js/EmployeePortal/Portal';
import '../src/components/css/style.css';
import EnterTimeSheet from './components/js/TimeSheet/EnterTimeSheet';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/Tasks' element={<Tasks />} />
          <Route path='/LMS' element={<Lms />} />
          <Route path='/EmployeePortal' element={<Portal />} />
          <Route path='/Profile' element={<Profile />} />
          <Route path='/EnterTimeSheet' element={<EnterTimeSheet />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
