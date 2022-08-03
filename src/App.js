import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/js/Login/Login';
import Home from './components/js/Home/Home';
import Lms from './components/js/LMS/LMS';
import Profile from './components/js/Profile/Profile';
import Tasks from './components/js/Tasks/Task';
import Portal from './components/js/EmployeePortal/Portal';
import SideBar from '../src/components/Sub-Component/Sidebar';
import '../src/components/css/style.css';
import EnterTimeSheet from './components/js/TimeSheet/TimeSheet';
import Settings from './components/js/Settings/Settings';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Login />} />
          <Route path='/Home' element={<SideBar Component={<Home />} />} />
          <Route path='/Tasks' element={<SideBar Component={<Tasks />} />} />
          <Route path='/LMS' element={<SideBar Component={<Lms />} />} />
          <Route path='/EmployeePortal' element={<SideBar Component={<Portal />} />} />
          <Route path='/Profile' element={<SideBar Component={<Profile />} />} />
          <Route path='/EnterTimeSheet' element={<SideBar Component={<EnterTimeSheet />} />} />
          <Route path='/Settings' element={<SideBar Component={<Settings />} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}


