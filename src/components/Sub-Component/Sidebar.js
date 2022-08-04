import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faHouseChimney, faLevelUpAlt, faTableList, faTasks, faUser, faUserDoctor, sett, faRightFromBracket, faUserGear } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import Male from "../../images/Male.png";
import Female from "../../images/Female.png";
import "../css/Sidebar.css";
import ToolTip from "./ToolTip";

const Sidebar = (props) => {
    const handelLogOut = () => {
        localStorage.clear();
    };
    const [IsOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();
    let images;
    try {
        images = require('../../images/Profile_' + localStorage['EmpId'] + '.png');
    } catch (error) {
        images = localStorage['Gender'] === 'Female' ? Female : Male
    }
    return (
        <>
            <div
                style={{ backgroundColor: localStorage["BgColor"], color: "#fff", width: "100%", textAlign: "center", padding: "10px", }}>
                <h2 style={{ margin: 0 }}>Analytic Brains</h2>
            </div>
            <div style={{ marginTop: "-60px" }}>
                <div>
                    <nav className={`sidebar ${IsOpen ? "close" : ""}`}>
                        <header>
                            <div className="image-text">
                                <NavLink to="/Settings" >
                                    <span className="image">
                                        <img src={images} alt="" />
                                        {/* <img src={localStorage["Gender"] === "Female" ? Female : Male} alt="" /> */}
                                    </span>
                                </NavLink>
                                <div className="text logo-text">
                                    <span className="name">{localStorage["Name"]}</span>
                                    <span className="profession">{localStorage["Designation"]}</span>
                                </div>
                            </div>
                            {<FontAwesomeIcon className="icon Side-toggle" icon={faChevronRight} onClick={() => { setIsOpen(!IsOpen); }} />}
                        </header>
                        <div className="menu-bar">
                            <div className="menu">
                                <div className="menu-links">
                                    {IsOpen ?
                                        <ToolTip title="Home" placement="left">
                                            <NavLink to="/Home" className={`nav-link tab ${pathname === "/Home" ? "active" : ""}`}>
                                                <FontAwesomeIcon icon={faHouseChimney} className="icon" />
                                                <span className="text nav-text"> Home</span>
                                            </NavLink>
                                        </ToolTip>
                                        :
                                        <NavLink to="/Home" className={`nav-link tab ${pathname === "/Home" ? "active" : ""}`}>
                                            <FontAwesomeIcon icon={faHouseChimney} className="icon" />
                                            <span className="text nav-text"> Home</span>
                                        </NavLink>
                                    }
                                    {IsOpen ?
                                        <ToolTip title="Time Sheet" placement="left">
                                            <NavLink to="/EnterTimeSheet" className={`nav-link tab ${pathname === "/EnterTimeSheet" ? "active" : ""}`}>
                                                <FontAwesomeIcon icon={faTableList} className="icon" />
                                                <span className="text nav-text">Time Sheet</span>
                                            </NavLink>
                                        </ToolTip>
                                        :
                                        <NavLink to="/EnterTimeSheet" className={`nav-link tab ${pathname === "/EnterTimeSheet" ? "active" : ""}`}>
                                            <FontAwesomeIcon icon={faTableList} className="icon" />
                                            <span className="text nav-text">Time Sheet</span>
                                        </NavLink>
                                    }
                                    {IsOpen ?
                                        <ToolTip title="Tasks" placement="left">
                                            <NavLink to="/Tasks" className={`nav-link tab ${pathname === "/Tasks" ? "active" : ""}`}>
                                                <FontAwesomeIcon icon={faTasks} className="icon" />
                                                <span className="text nav-text">Tasks</span>
                                            </NavLink>
                                        </ToolTip>
                                        :
                                        <NavLink to="/Tasks" className={`nav-link tab ${pathname === "/Tasks" ? "active" : ""}`}>
                                            <FontAwesomeIcon icon={faTasks} className="icon" />
                                            <span className="text nav-text">Tasks</span>
                                        </NavLink>
                                    }
                                    {IsOpen ?
                                        <ToolTip title="LMS" placement="left">
                                            <NavLink to="/LMS" className={`nav-link tab ${pathname === "/LMS" ? "active" : ""}`}>
                                                <FontAwesomeIcon icon={faLevelUpAlt} className="icon" />
                                                <span className="text nav-text">LMS</span>
                                            </NavLink>
                                        </ToolTip>
                                        :
                                        <NavLink to="/LMS" className={`nav-link tab ${pathname === "/LMS" ? "active" : ""}`}>
                                            <FontAwesomeIcon icon={faLevelUpAlt} className="icon" />
                                            <span className="text nav-text">LMS</span>
                                        </NavLink>
                                    }
                                    {IsOpen ?
                                        <ToolTip title="Employee Portal" placement="left">
                                            <NavLink to="/EmployeePortal" className={`nav-link tab disabled ${pathname === "/EmployeePortal" ? "active" : ""}`}>
                                                <FontAwesomeIcon icon={faUserDoctor} className="icon" />
                                                <span className="text nav-text">Employee Portal</span>
                                            </NavLink>
                                        </ToolTip>
                                        :
                                        <NavLink to="/EmployeePortal" className={`nav-link tab disabled ${pathname === "/EmployeePortal" ? "active" : ""}`}>
                                            <FontAwesomeIcon icon={faUserDoctor} className="icon" />
                                            <span className="text nav-text">Employee Portal</span>
                                        </NavLink>
                                    }
                                    {IsOpen ?
                                        <ToolTip title="Profile" placement="left">
                                            <NavLink to="/Profile" className={`nav-link tab ${pathname === "/Profile" ? "active" : ""}`}>
                                                <FontAwesomeIcon icon={faUser} className="icon" />
                                                <span className="text nav-text">Profile</span>
                                            </NavLink>
                                        </ToolTip>
                                        :
                                        <NavLink to="/Profile" className={`nav-link tab ${pathname === "/Profile" ? "active" : ""}`}>
                                            <FontAwesomeIcon icon={faUser} className="icon" />
                                            <span className="text nav-text">Profile</span>
                                        </NavLink>
                                    }
                                    {IsOpen ?
                                        <ToolTip title="Settings" placement="left">
                                            <NavLink to="/Settings" className={`nav-link tab ${pathname === "/Settings" ? "active" : ""}`}>
                                                <FontAwesomeIcon icon={faUserGear} className="icon" />
                                                <span className="text nav-text">Settings</span>
                                            </NavLink>
                                        </ToolTip>
                                        :
                                        <NavLink to="/Settings" className={`nav-link tab ${pathname === "/Settings" ? "active" : ""}`}>
                                            <FontAwesomeIcon icon={faUserGear} className="icon" />
                                            <span className="text nav-text">Settings</span>
                                        </NavLink>
                                    }
                                </div>
                            </div>
                            <div className="bottom-content">
                                {IsOpen ?
                                    <ToolTip title="Logout" placement="left">
                                        <NavLink to="/" onClick={handelLogOut} className="nav-link tab">
                                            <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
                                            <span className="text nav-text">Logout</span>
                                        </NavLink>
                                    </ToolTip>
                                    :
                                    <NavLink to="/" onClick={handelLogOut} className="nav-link tab">
                                        <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
                                        <span className="text nav-text">Logout</span>
                                    </NavLink>
                                }
                            </div>
                        </div>
                    </nav>
                    <section className="body">
                        <div className="text">
                            <div className="scrollbar">
                                <div style={{ marginTop: "20px" }}>{props["Component"]}</div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
