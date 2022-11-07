import React, { useState, useEffect, } from 'react';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json'
import { useNavigate } from "react-router-dom";
import AbLogo from '../../../images/AB_logo.png'

export default function ChangePassword(props) {
    const EmpId = localStorage['EmpId'];

    const DetailsFields = () => {
        const navigate = useNavigate();
        const [Details, setDetails] = useState({})
        const [isOTPSent, setIsOTPSent] = useState(false);
        const [isOTPVerified, setIsOTPVerified] = useState(false);
        const [OTP, setOTP] = useState();
        const handelTabChange = props['handelTabChange'];
        const [password, setPassword] = useState({ NewPassword: '', ConfirmNewPassword: '' });
        const Navigate = (path) => {
            navigate(path);
        }
        // useEffect(() => {
        //     // axios.post(nodeurl['nodeurl'], { query: 'AB_ViewEmpProfile ' + EmpId }).then(result => {
        //     //     setDetails(result.data[0][0]);
        //     // });
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
                    { query: "Update EmployeeDetails set Password='" + password['NewPassword'] + "' where UserName=" + Details['UserName'] }).then(result => {
                        console.log('updated.... ');
                        Navigate('/')
                    });
            }

        }
        const handelPWDChange = (e) => {
            setPassword({ ...password, [e.target.name]: e.target.value })
        }
        const handelClick = (e) => {
            debugger
            if (!isOTPSent) {
                e.target.textContent = 'Verify'
                setIsOTPSent(true);
                axios.post(nodeurl['nodeurl'], { query: 'LM_ForgotPassword ' + EmpId + ',' + Details['UserName'] }).then(result => {
                    let msg = result.data.recordset[0][''];
                    if (msg !== '')
                        alert.show(msg);
                });
            }
            else if (!isOTPVerified) {
                axios.post(nodeurl['nodeurl'],
                    { query: 'select case when otp=' + OTP + ' then 1 else 0 end AS Date from EmployeeDetails where UserName=' + Details['UserName'] }).then(result => {
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
                                <input type="text" className="input-input" name="OneTimePassword" value={OTP} onChange={(e) => { setOTP(e.target.value) }} />
                                <label className="input-label">One Time Password</label>
                            </div>
                        </div>
                    </div>
                    }
                    {isOTPVerified && <div style={{ margin: '30px 30px 0 0', width: '30%', display: 'inline-block' }}>
                        <div className="title">Forgot Password</div>
                        <div className="input-wrapper marginLeft-0">
                            <div className="input-holder">
                                <input type="text" className="input-input" name="NewPassword" value={password['NewPassword']} onChange={handelPWDChange} />
                                <label className="input-label">New Password</label>
                            </div>
                        </div>
                        <div className="input-wrapper marginLeft-0">
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
                        <button className='btn marginLeft-0 marginRight-0 d-none float-right' style={{ width: '110px' }} onClick={handelSubmitClick}>Resend OTP</button>
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
