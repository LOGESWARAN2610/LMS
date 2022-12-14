import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faHouseChimney, faLevelUpAlt, faTableList, faTasks, faUser, faUserDoctor, faRightFromBracket, faUserGear } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import Male from "../../images/Male.png";
import Female from "../../images/Female.png";
import axios from 'axios';
import nodeurl from '../../nodeServer.json'
import "../css/Sidebar.css";
import ToolTip from "./ToolTip";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const Sidebar = (props) => {
    const [IsOpen, setIsOpen] = useState(false);
    const { pathname } = useLocation();
    let images;
    // const handelLogOut = () => {
    //     localStorage.clear();
    // };

    if (localStorage.getItem('SessionId') === undefined || localStorage.getItem('SessionId') === null)
        window.location.href = '/'
    else if (localStorage.getItem('SessionId') !== undefined || localStorage.getItem('SessionId') !== null)
        axios.post(nodeurl['nodeurl'], { query: "select ExpireStatus from EmpSession where Sessionid='" + localStorage.getItem('SessionId') + "'" }).then(result => {
            if (result.data[0][0]['ExpireStatus'] === 0)
                window.location.hef = '/'
        });
    const options = {
        timeout: 5000,
        position: positions.BOTTOM_RIGHT
    };

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
                    <h2 className="AB" >
                        <img style={{ height: '45px', marginBottom: '-3px', marginRight: '5px' }} src={require('../../images/AB_logo.png')} alt="AB" />
                        <span style={{ fontSize: '40px' }}>A</span><span style={{ fontSize: '30px' }}>nalytic </span><span style={{ fontSize: '40px' }}>B</span><span style={{ fontSize: '30px' }}>rains</span>
                    </h2>
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
                                            <NavLink to="/" className="nav-link tab">
                                                <FontAwesomeIcon icon={faRightFromBracket} className="icon" />
                                                <span className="text nav-text">Logout</span>
                                            </NavLink>
                                        </ToolTip>
                                        :
                                        <NavLink to="/" className="nav-link tab">
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
                                    <div style={{ marginTop: "10px" }}>{props["Component"]}</div>
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
