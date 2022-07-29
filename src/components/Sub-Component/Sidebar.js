import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faChevronRight, faHouseChimney, faLevelUpAlt, faTableList, faTasks, faUser, faUserDoctor, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";
import Male from '../../images/Male.png';
import Female from '../../images/Female.png';
import '../css/Sidebar.css'

const Sidebar = (props) => {
    const handelLogOut = () => {
        localStorage.clear();
    }
    const [IsOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();
    return (
        <>
            <div style={{ backgroundColor: localStorage['BgColor'], color: '#fff', width: '100%', textAlign: 'center', padding: '10px' }}>
                <h2 style={{ margin: 0 }}>Analytic Brains</h2>
            </div>
            <div style={{ marginTop: '-60px' }}>
                <div>
                    <nav className={`sidebar ${IsOpen ? 'close' : ''}`}>
                        <header>
                            <div className="image-text">
                                <span className="image">
                                    <img src={localStorage['Gender'] === 'Female' ? Female : Male} alt="" />
                                </span>
                                <div className="text logo-text">
                                    <span className="name">{localStorage['Name']}</span>
                                    <span className="profession">Developer</span>
                                </div>
                            </div>
                            {<FontAwesomeIcon className='icon Side-toggle' icon={faChevronRight} onClick={() => {
                                setIsOpen(!IsOpen);
                            }} />}
                        </header>
                        <div className="menu-bar">
                            <div className="menu">

                                <div className="menu-links">
                                    <NavLink to="/Home" className={`nav-link tab ${pathname === '/Home' ? 'active' : ''}`} >
                                        <FontAwesomeIcon icon={faHouseChimney} className="icon" />
                                        <span className="text nav-text">Home</span>
                                    </NavLink>

                                    <NavLink to="/EnterTimeSheet" className={`nav-link tab ${pathname === '/EnterTimeSheet' ? 'active' : ''}`} >
                                        <FontAwesomeIcon icon={faTableList} className="icon" />
                                        <span className="text nav-text">Time Sheet</span>
                                    </NavLink>

                                    <NavLink to="/Tasks" className={`nav-link tab ${pathname === '/Tasks' ? 'active' : ''}`} >
                                        <FontAwesomeIcon icon={faTasks} className="icon" />
                                        <span className="text nav-text">Tasks</span>
                                    </NavLink>
                                    <NavLink to="/LMS" className={`nav-link tab ${pathname === '/LMS' ? 'active' : ''}`} >
                                        <FontAwesomeIcon icon={faLevelUpAlt} className="icon" />
                                        <span className="text nav-text">LMS</span>
                                    </NavLink>
                                    <NavLink to="/EmployeePortal" className={`nav-link tab disabled ${pathname === '/EmployeePortal' ? 'active' : ''}`} >
                                        <FontAwesomeIcon icon={faUserDoctor} className="icon" />
                                        <span className="text nav-text">Employee Portal</span>
                                    </NavLink>
                                    <NavLink to="/Profile" className={`nav-link tab ${pathname === '/Profile' ? 'active' : ''}`} >
                                        <FontAwesomeIcon icon={faUser} className="icon" />
                                        <span className="text nav-text">Profile</span>
                                    </NavLink>
                                </div>
                            </div>
                            <div className="bottom-content">
                                <NavLink to="/" onClick={handelLogOut} className="nav-link tab" >
                                    <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
                                    <span className="text nav-text">Logout</span>
                                </NavLink>
                            </div>
                        </div>
                    </nav>
                    <section className="body">
                        <div className="text">
                            <div className='scrollbar'>
                                <div style={{ marginTop: '20px' }}>
                                    {props['Component']}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div >
        </>
    );
};

export default Sidebar;