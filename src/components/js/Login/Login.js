import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/Login.css';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
// import ChangePassword from '../../js/Profile/ChangePassword'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import nodeurl from '../../../nodeServer.json'
import AbLogo from '../../../images/AB_logo.png'

const Login = () => {
    const FullWidthTabs = (props) => {
        const [value, setValue] = useState(0);
        const navigate = useNavigate();
        const handelTabChange = (e) => {
            setValue(parseInt(e.target.value));
        }
        useEffect(() => {
            document.documentElement.style.setProperty('--background-color', '#0589a0');
            document.documentElement.style.setProperty('--color', '#fff');
            if (localStorage.getItem('SessionId') !== undefined && localStorage.getItem('SessionId') !== null) {
                axios.post(nodeurl['nodeurl'], { query: "AB_SessionIDExpire '" + localStorage.getItem('SessionId') + "'" }).then(result => {
                    console.log('Cleared')
                    localStorage.clear();
                });
            }
        }, [])
        const LogInPage = () => {
            const [input, setInput] = useState({});
            const [errors, setErrors] = useState({});
            const [passwordType, setPasswordType] = useState("password");

            const handleChange = (event) => {
                let value = event.target.value;
                if (value.substr(value.length - 1) === '@' && event.target.name === 'email') {
                    value = value + 'analyticbrains.com';
                    value = value.split('@').filter(function (item, i, allItems) {
                        return i === allItems.indexOf(item);
                    }).join('@');
                    event.target.value = value;
                }
                var validate_UN = '', validate_PWD = '';
                input[event.target.name] = event.target.value;
                setInput(input)
                if (typeof input["email"] !== "undefined") {
                    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
                    if (!pattern.test(input["email"])) {
                        validate_UN = "Please enter valid email address.";
                    }
                }
                if (typeof input["password"] !== "undefined") {
                    if (input["password"].length < 6) {
                        validate_PWD = "Please add at least 6 charachter.";
                    }
                }
                setErrors({ email: validate_UN, password: validate_PWD });
            }
            const Navigate = (path) => {
                navigate(path);
            }
            const handleSubmit = (event) => {
                event.preventDefault();
                if (validate()) {
                    setErrors({})
                    let email = input.email;
                    let password = input.password;
                    var query = { query: "AB_LoginValidation '" + email + "','" + password + "'" };
                    axios.post(nodeurl['nodeurl'], query)
                        .then(res => {
                            let msg = '';
                            if (res.data.length === 0) {
                                msg = ('Please enter valid username and password!');
                                return false;
                            }
                            var loginDetails = res.data[0][0];
                            if (loginDetails['AccStatus'] === 1) {
                                localStorage.clear();
                                localStorage.setItem('EmpId', loginDetails['EmpId']);
                                localStorage.setItem('SessionId', loginDetails['SessionId']);
                                localStorage.setItem('UserName', loginDetails['UserName']);
                                localStorage.setItem('Name', loginDetails['Name']);
                                localStorage.setItem('Gender', loginDetails['Gender']);
                                localStorage.setItem('Designation', loginDetails['Designation']);
                                localStorage.setItem('IsManager', loginDetails['IsManager']);
                                localStorage.setItem('isProfileChanged', false);
                                const color = loginDetails['Theme'].split(',');
                                localStorage.setItem('BgColor', color[0]);
                                localStorage.setItem('Color', color[1]);
                                Navigate('/Home');
                            } else if (loginDetails['AccStatus'] === 0) {
                                msg = ('Please enter the correct User Name and Password!');
                            } else if (loginDetails['AccStatus'] === 2) {
                                msg = ('login attempts exceeded!! Please Contact admin!');
                            } else if (loginDetails['AccStatus'] === 3) {
                                msg = ('Your account has been locked!!! Please Contact admin!');
                            } else if (loginDetails['AccStatus'] === 4) {
                                msg = ('Please enter valid username and password!');
                            }
                            setErrors({ ...errors, password: msg })
                        });
                }
            }
            window.addEventListener('keydown', (event) => {
                if (event.keyCode === 13) handleSubmit(event);
            });
            const validate = () => {
                let isValid = true;
                var validate_UN = '', validate_PWD = '';
                if (!input["email"]) {
                    isValid = false;
                    validate_UN = "Please enter your email Address.";
                }
                if (typeof input["email"] !== "undefined") {
                    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
                    if (!pattern.test(input["email"])) {
                        isValid = false;
                        validate_UN = "Please enter valid email address.";
                    }
                }
                if (!input["password"]) {
                    isValid = false;
                    validate_PWD = "Please enter your password.";
                }
                if (typeof input["password"] !== "undefined") {
                    if (input["password"].length < 6) {
                        isValid = false;
                        validate_PWD = "Please add at least 6 character.";
                    }
                }
                setErrors({ email: validate_UN, password: validate_PWD });
                return isValid;
            }
            const handelShowPwd = (e) => {
                var txt = e.target.innerHTML;
                if (txt === '🐵') {
                    e.target.innerHTML = '🙈';
                    setPasswordType("password")
                }
                else {
                    e.target.innerHTML = '🐵';
                    setPasswordType("text");
                }
            }
            return (
                <>
                    <div style={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px', textAlign: 'center' }}>
                        <img src={AbLogo} alt="AB Logo" style={{ width: '50px', float: 'center' }} />
                        <h1 style={{ color: '#0589a0', fontSize: '35px', marginBottom: '10px' }}>Analytic Brains</h1>
                    </div>
                    <div className="title">Login</div>
                    <div className="input input--open" style={{ margin: '35px 0px 65px 0' }}>
                        <div className="input-holder">
                            <input type="text" onChange={handleChange} className="input-input" id="name"
                                onClick={(e) => {
                                    e.target.setSelectionRange(0, e.target.value.indexOf('@'))
                                }} name="email" />
                            {errors.email && <div className={(errors.email ? 'text-danger' : '')}>{errors.email}</div>}
                            <label className="Input-label">user name</label>
                        </div>
                    </div>
                    <div className="input input--open" style={{ margin: '25px 0 30px 0' }}>
                        <div className="input-holder">
                            <input type={passwordType} onChange={handleChange} className="input-input" id="password"
                                onClick={(e) => {
                                    e.target.select()
                                }} name="password" />
                            <span onClick={handelShowPwd} style={{ zIndex: '111111', cursor: 'pointer', position: 'absolute', right: '10px', top: '12px' }}>🙈</span>
                            {errors.password && <div style={{ marginBottom: '10px' }} className={(errors.password ? 'text-danger' : '')}>{errors.password}</div>}
                            <label className="Input-label">password</label>
                        </div>
                    </div>
                    <div style={{ width: '80%', display: 'revert', marginBottom: '10px' }}>
                        <button className='btn marginLeft-0 marginRight-0 float-right' style={{ width: '110px', marginTop: '10px' }} onClick={handleSubmit}>Log In</button>
                        <button className="button btnForgotPwd" value="1" style={{ margin: '15px 15px 15px 0', float: 'left', marginTop: '10px' }} onClick={handelTabChange}>Forgot Password ?</button>
                    </div>
                </>
            )
        }
        const ChangePassword = (props) => {
            // const EmpId = localStorage['EmpId'];

            const DetailsFields = () => {
                const navigate = useNavigate();
                const [Details, setDetails] = useState({})
                const [isOTPSent, setIsOTPSent] = useState(false);
                const [isOTPVerified, setIsOTPVerified] = useState(false);
                const [OTP, setOTP] = useState();
                // const handelTabChange = props['handelTabChange'];
                const [password, setPassword] = useState({ NewPassword: '', ConfirmNewPassword: '' });
                const Navigate = (path) => {
                    navigate(path);
                }
                // useEffect(() => {
                //     axios.post(nodeurl['nodeurl'], { query: 'AB_ViewEmpProfile ' + EmpId }).then(result => {
                //         setDetails(result.data[0][0]);
                //     });
                // }, []);
                const handelOnChange = (event) => {
                    let value = event.target.value;
                    if (value.substr(value.length - 1) === '@' && event.target.name === 'UserName') {
                        value = value + 'analyticbrains.com';
                        value = value.split('@').filter(function (item, i, allItems) {
                            return i === allItems.indexOf(item);
                        }).join('@');
                        event.target.value = value;
                    }
                    setDetails({ ...Details, [event.target.name]: event.target.value });
                }
                const handelSubmitClick = () => {
                    if (password['NewPassword'] === password['ConfirmNewPassword']) {
                        axios.post(nodeurl['nodeurl'],
                            { query: "Update EmployeeDetails set Password='" + password['NewPassword'] + "' where UserName='" + Details['UserName'] + "'" }).then(result => {
                                console.log('updated.... ');
                                Navigate('/')
                            });
                    }

                }
                const handelPWDChange = (e) => {
                    setPassword({ ...password, [e.target.name]: e.target.value })
                }
                const handelClick = (e) => {
                    if (!isOTPSent) {
                        e.target.textContent = 'Verify'
                        setIsOTPSent(true);
                        axios.post(nodeurl['nodeurl'], { query: "LM_ForgotPassword '" + Details['UserName'] + "'" }).then(result => {
                            let msg = result.data[0][0][''];
                            if (msg !== '')
                                alert.show(msg);
                        });
                    }
                    else if (!isOTPVerified) {
                        axios.post(nodeurl['nodeurl'],
                            { query: "select case when otp=" + OTP + " then 1 else 0 end AS Date from EmployeeDetails where UserName='" + Details['UserName'] + "'" }).then(result => {
                                if (result.data[0][0]['Date'] === 1)
                                    setIsOTPVerified(true);
                            });
                    }
                }
                return (
                    <>
                        <div style={{ borderTopLeftRadius: '5px', borderTopRightRadius: '5px', textAlign: 'center' }}>
                            <img src={AbLogo} alt="AB Logo" style={{ width: '50px', float: 'center' }} />
                            <h1 style={{ color: '#0589a0', fontSize: '35px', marginBottom: '10px' }}>Analytic Brains</h1>
                        </div>
                        <div style={{ flexDirection: 'row', display: 'flex' }}>
                            {!isOTPVerified && <div style={{ width: '100%', display: 'inline-block' }}>
                                <div className="title">Forgot Password</div>
                                <div className="input-wrapper marginLeft-0" style={{ margin: '35px 0px' }}>
                                    <div className="input-holder">
                                        <input type="text" className="input-input" name="UserName" onClick={(e) => {
                                            e.target.setSelectionRange(0, e.target.value.indexOf('@'))
                                        }}
                                            value={Details['UserName']} onChange={handelOnChange} />
                                        <label className="input-label">User Name</label>
                                    </div>
                                </div>
                                <div className="input-wrapper marginLeft-0" style={{ margin: '25px 0px' }}>
                                    <div className="input-holder">
                                        <input type="text" className="input-input" disabled={!isOTPSent} placeholder="OTP" name="OneTimePassword" value={OTP} onChange={(e) => { setOTP(e.target.value) }} />
                                        <label className="input-label">One Time Password</label>
                                    </div>
                                </div>
                            </div>
                            }
                            {isOTPVerified && <div style={{ width: '100%', display: 'inline-block' }}>
                                <div className="title">Forgot Password</div>
                                <div className="input-wrapper marginLeft-0" style={{ margin: '35px 0px' }}>
                                    <div className="input-holder">
                                        <input type="text" className="input-input" name="NewPassword" value={password['NewPassword']} onChange={handelPWDChange} />
                                        <label className="input-label">New Password</label>
                                    </div>
                                </div>
                                <div className="input-wrapper marginLeft-0" style={{ margin: '25px 0px' }}>
                                    <div className="input-holder">
                                        <input type="text" className="input-input" name="ConfirmNewPassword" value={password['ConfirmNewPassword']} onChange={handelPWDChange} />
                                        <label className="input-label">Confirm New Password</label>
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                        <div style={{ width: '80%', display: 'revert', marginBottom: '10px' }}>
                            <button className="button btnNewUser" style={{ margin: '15px 15px 15px 0', float: 'left', width: '110px' }} value="0" onClick={handelTabChange}>Login ?</button>
                            {!isOTPVerified && <button className='btn marginLeft-0 marginRight-0 float-right' style={{ width: '110px' }} onClick={handelClick}>Send OTP</button>}
                            {isOTPVerified && <div>
                                {/* <button className='btn marginLeft-0 marginRight-0 d-none float-right' style={{ width: '110px' }} onClick={handelSubmitClick}>Resend OTP</button> */}
                                <button className='btn marginLeft-0 marginRight-0 float-right' style={{ width: '110px' }} onClick={handelSubmitClick}>Save</button>
                            </div >}
                        </div >
                        <br />
                        <br />
                    </>
                );
            }
            return (
                <DetailsFields />
            )
        }
        function TabPanel(props) {
            const { children, value, index, ...other } = props;
            return (
                <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`full-width-tabpanel-${index}`}
                    aria-labelledby={`full-width-tab-${index}`}
                    {...other}
                >
                    {value === index && (
                        <Box sx={{ p: 3 }}>
                            <Typography component={"span"} variant={"body2"}>{children}</Typography>
                        </Box>
                    )}
                </div>
            );
        }

        TabPanel.propTypes = {
            children: PropTypes.node,
            index: PropTypes.number.isRequired,
            value: PropTypes.number.isRequired,
        };

        // function a11yProps(index) {
        //     return {
        //         id: `full-width-tab-${index}`,
        //         'aria-controls': `full-width-tabpanel-${index}`,
        //     };
        // }
        const resetAttempt = (e) => {
            axios.post(nodeurl['nodeurl'],
                { query: "update EmployeeDetails set attempt=0 where UserName='" + e.target.value + "' or empid=" + e.target.value }).then(result => {
                    console.log('Done');
                });
        }

        // const handleChange = (event, newValue) => {
        //     window.alert(newValue)
        //     setValue(newValue);
        // }
        const handleChangeIndex = (index) => {
            setValue(index);
        };
        return (
            <>
                <div className="login-container">
                    <Box id="logIn" sx={{ bgcolor: 'inherit' }}>
                        <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
                            <TabPanel value={value} index={0}>
                                <LogInPage />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <ChangePassword />
                            </TabPanel>
                        </SwipeableViews>
                    </Box >
                </div>
                <div className="input input--open" style={{ margin: '0 auto', display: 'none' }}>
                    <div className="input-holder">
                        <input type="text" onBlur={resetAttempt} className="input-input"
                            onClick={(e) => {
                                e.target.select()
                            }} name="attemptReset" />
                        <label className="Input-label">Attempt Reset</label>
                    </div>
                </div>
            </>
        );
    }
    return (<FullWidthTabs />);
}

export default Login