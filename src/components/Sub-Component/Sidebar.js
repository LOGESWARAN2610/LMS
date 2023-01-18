import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faHouseChimney, faLevelUpAlt, faTableList, faTasks, faUser, faUserDoctor, faRightFromBracket, faUserGear } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import nodeurl from '../../nodeServer.json'
import ToolTip from "./ToolTip";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { useEffect } from "react";

const Sidebar = (props) => {
    const [IsOpen, setIsOpen] = useState(false);
    const [profileName, setProfileName] = useState('');
    const { pathname } = useLocation();
    // const handelLogOut = () => {
    //     localStorage.clear();
    // };

    const options = {
        timeout: 5000,
        position: positions.BOTTOM_RIGHT
    };

    const [pendingCount, setPendingCount] = useState({ leaveCount: 0, permissionCount: 0, lopCount: 0, approvelTotalCount: 0 });
    useEffect(() => {
        if (localStorage.getItem('SessionId') === undefined || localStorage.getItem('SessionId') === null) {
            window.location.href = '/';
            return;
        }
        else if (localStorage.getItem('SessionId') !== undefined || localStorage.getItem('SessionId') !== null) {
            axios.post(nodeurl['nodeurl'], { query: "select ExpireStatus from EmpSession where Sessionid='" + localStorage.getItem('SessionId') + "'" }).then(result => {
                if (result.data[0][0]['ExpireStatus'] === 0)
                    window.location.hef = '/';
                return;
            });
        }
        axios.post(nodeurl['nodeurl'], { query: 'LM_GetPendingCount ' + localStorage['EmpId'] }).then(result => {
            setPendingCount(result.data[0][0]);
        });
        axios.post(nodeurl['nodeurl'], { query: "Select ISNULL(ProfileName,'') ProfileName FROM EmployeeDetails WHERE EmpId=" + localStorage['EmpId'] }).then(result => {
            if (result.data[0][0]['ProfileName'] !== '')
                setProfileName(result.data[0][0]['ProfileName']);
            else
                setProfileName(localStorage['Gender'] + '.png');
        });
    }, [localStorage])
    const getLabel = (text, count) => {
        return <>
            {text}
            {count !== 0 ? <span className="labelCount">{count}</span> : null}
        </>
    }
    var Tabs = [
        { text: 'Home', link: '/Home', icon: faHouseChimney, isManagerSide: false },
        { text: 'Time Sheet', link: '/EnterTimeSheet', icon: faTableList, isManagerSide: false },
        { text: 'Tasks', link: '/Tasks', icon: faTasks, isManagerSide: false },
        { text: 'Leave & Permission', link: '/LMS', icon: faLevelUpAlt, isManagerSide: false },
        { text: getLabel('Approvals', pendingCount['approvelTotalCount']), link: '/Approvals', icon: faLevelUpAlt, isManagerSide: true },
        { text: 'Employee Portal', link: '/EmployeePortal', icon: faUserDoctor, isManagerSide: false },
        { text: 'Notes', link: '/Notes', icon: faUser, isManagerSide: false },
        { text: 'Profile', link: '/Profile', icon: faUser, isManagerSide: false },
        { text: 'Settings', link: '/Settings', icon: faUserGear, isManagerSide: false },
        // { text: 'Logout', link: '/', icon: faRightFromBracket, isManagerSide: false }
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
                    <h2 className="AB">
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
                                            <img src={window.location.protocol + '//' + window.location.host + '/images/' + profileName} alt="Profile" />
                                        </span>

                                    </NavLink>
                                    <div className="text logo-text">
                                        {getName()}
                                        {/* {getDesignation()} */}
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
                                        <div style={{ borderTop: '1px solid #fff', marginTop: '10px' }}>
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
                                </div>
                                {/* <div className="bottom-content">
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
                                </div> */}
                            </div>
                        </nav>
                        <section className="body">
                            <div>
                                <div className="scrollbar scrollBody">
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
