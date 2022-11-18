import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faHouseChimney, faLevelUpAlt, faTableList, faTasks, faUser, faUserDoctor, faRightFromBracket, faUserGear } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import Male from "../../images/Male.png";
import Female from "../../images/Female.png";
import "../css/Sidebar.css";
import ToolTip from "./ToolTip";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const Sidebar = (props) => {
    const handelLogOut = () => {
        localStorage.clear();
    };
    const options = {
        timeout: 5000,
        position: positions.BOTTOM_RIGHT
    };
    const [IsOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();
    let images;
    try {
        images = require('../../../Images/Profile_' + localStorage['EmpId'] + '.png');
    } catch (error) {
        images = localStorage['Gender'] === 'Female' ? Female : Male
    }
    var Tabs = [
        { text: 'Home', link: '/Home', icon: faHouseChimney, isManagerSide: false },
        { text: 'Time Sheet', link: '/EnterTimeSheet', icon: faTableList, isManagerSide: false },
        { text: 'Tasks', link: '/Tasks', icon: faTasks, isManagerSide: false },
        { text: 'Leave & Permission', link: '/LMS', icon: faLevelUpAlt, isManagerSide: false },
        { text: 'Approvals', link: '/Approvals', icon: faLevelUpAlt, isManagerSide: true },
        { text: 'Employee Portal', link: '/EmployeePortal', icon: faUserDoctor, isManagerSide: false },
        { text: 'Profile', link: '/Profile', icon: faUser, isManagerSide: false },
        { text: 'Settings', link: '/Settings', icon: faUserGear, isManagerSide: false }
        // { text: 'WorkPlace', link: '/WorkPlace', icon: faUserGear }
    ];
    debugger
    if (parseInt(localStorage['IsManager']) !== 1) {
        Tabs = Tabs.filter((item) => {
            return !item['isManagerSide']
        });
    }
    const getName = () => {
        return (<span className="name"> {localStorage["Name"]} </span>);
    }
    const getDesignation = () => {
        return (<><span className="profession">{localStorage["Designation"].split('-')[0]}</span>
            {localStorage["Designation"].split('-')[1] && <span className="profession">{localStorage["Designation"].split('-')[1]}</span>}
        </>);
    }
    return (
        <>
            <Provider template={AlertTemplate} {...options}>
                <div className="ABWrapper">
                    <h2 className="AB" >Analytic Brains</h2>
                </div>
                <div style={{ marginTop: "-60px" }}>
                    <div>
                        <nav className={`sidebar ${IsOpen ? "close" : ""}`}>
                            <header>
                                <div className="image-text">
                                    <NavLink to="/Settings" >
                                        <span className="image">
                                            <img src={images} alt="Profile" />
                                        </span>
                                    </NavLink>
                                    <div className="text logo-text">
                                        {getName()}
                                        {getDesignation()}
                                    </div>
                                </div>
                                {<FontAwesomeIcon className="icon Side-toggle" icon={faChevronRight} onClick={() => { setIsOpen(!IsOpen); }} />}
                            </header>
                            <div className="menu-bar">
                                <div className="menu">
                                    <div className="menu-links">
                                        {Tabs.map((item, index) => {
                                            return (
                                                IsOpen ?
                                                    <ToolTip key={index} title={item['text']} placement="left">
                                                        <NavLink to={item['link']} className={`nav-link tab ${pathname === item['link'] ? "active" : ""}`}>
                                                            <FontAwesomeIcon icon={item['icon']} className="icon" />
                                                            <span className="text nav-text">{item['text']}</span>
                                                        </NavLink>
                                                    </ToolTip>
                                                    :
                                                    <NavLink key={index} to={item['link']} className={`nav-link tab ${pathname === item['link'] ? "active" : ""}`}>
                                                        <FontAwesomeIcon icon={item['icon']} className="icon" />
                                                        <span className="text nav-text"> {item['text']}</span>
                                                    </NavLink>
                                            )
                                        })}
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
                            <div>
                                <div className="scrollbar">
                                    <div style={{ marginTop: "20px" }}>{props["Component"]}</div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </Provider>
        </>
    );
};

export default Sidebar;
