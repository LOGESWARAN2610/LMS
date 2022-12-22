import React, { useState, useEffect } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Moment from 'moment';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json';
import DatePicker from '../../Sub-Component/DatePicker/DatePicker';
import { useAlert } from "react-alert";
import { confirm } from "react-confirm-box";

export default function LeaveBalanceTab() {
    let EmpId = localStorage['EmpId'];
    const alert = useAlert();
    const [expanded, setExpanded] = useState(false);
    const [ActiveTab, setActiveTab] = useState(1);
    const [ComDate, setComDate] = useState([]);
    const [PrevComDate, setPrevComDate] = useState([]);
    const optionsWithLabelChange = {
        closeOnOverlayClick: true,
        labels: {
            confirmable: "Confirm",
            cancellable: "Cancel"
        }
    };


    const handleChange = (panel) => (event, isExpanded) => {
        if (panel === -1) return;
        let msg = null;
        setActiveTab(panel + 1);
        msg = Data[panel]['currentblc'] === 0 ? msg = <><b>You are applying leave more than the available balance!!!</b> <br /><br />  Do you want to proceed?</> : null;
        if (msg !== null && expanded !== panel) {
            handelConfirm(msg, isExpanded, panel);
            return;
        }
        setExpanded(isExpanded ? panel : false);

    };
    const handelConfirm = async (msg, isExpanded, panel) => {
        if (await confirm(msg, optionsWithLabelChange))
            setExpanded(isExpanded ? panel : false);
    }

    const [Data, setData] = useState([]);
    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: 'SP_LM_LeaveBalance ' + EmpId + '' }).then(result => {
            let data = result.data[0];
            data.push({ LeaveType: 'Total', OpeningBalance: 0, EarnedLeave: 0, LeavesTaken: 0, currentblc: 0, LOP: 0 });
            for (let i = 0; i < data.length - 1; i++) {
                data[data.length - 1].OpeningBalance += data[i].OpeningBalance;
                data[data.length - 1].EarnedLeave += data[i].EarnedLeave;
                data[data.length - 1].LeavesTaken += data[i].LeavesTaken;
                data[data.length - 1].currentblc += data[i].currentblc;
                data[data.length - 1].LOP += data[i].LOP;
            }
            setData(data);
            setComDate(result.data[1]);
            setPrevComDate(result.data[2]);
        });
    }, [EmpId]);
    const LeaveApplyTab = () => {
        const [isVisavle, setIsVisavle] = useState(false);
        const [Option, setOption] = useState([{}]);
        const [Details, setDetails] = useState({
            EmpId: localStorage['EmpId'], startDate: Moment(new Date()).format('MM-DD-YYYY'), endDate: Moment(new Date()).format('MM-DD-YYYY'),
            Duration: 0, NoOfDays: 1, Reason: '', LeaveOption: 0, Dates: '-1', LeaveId: 1
        });

        const handelOnChange = (event) => {
            Details['LeaveId'] = ActiveTab;
            if (event.target.name === 'startDate')
                Details['NoOfDays'] = getBusinessDatesCount(event.target.value, Details['endDate']);
            else if (event.target.name === 'endDate')
                Details['NoOfDays'] = getBusinessDatesCount(Details['startDate'], event.target.value);
            else if (event.target.name === 'Duration')
                Details['NoOfDays'] = event.target.value;
            if (Details['NoOfDays'] <= 1) Details['Duration'] = 1;
            if (event.target.name === 'LeaveOption') {
                if (event.target.value === '1') {
                    Details['Dates'] = ComDate[0]['Date_'] === undefined ? '-1' : ComDate[0]['Date_'];
                    setOption(ComDate);
                    setIsVisavle(true);
                }
                else if (event.target.value === '2') {
                    Details['Dates'] = PrevComDate.length === 0 ? '-1' : PrevComDate[0]['Date_'];
                    setOption(PrevComDate);
                    setIsVisavle(true);
                } else {
                    setIsVisavle(false);
                }
            }
            setDetails({ ...Details, [event.target.name]: event.target.value });
        }

        const handelApplyConfirm = async () => {
            let msg = <><b>You are applying for leave more than available balance.This would result in loss  of pay!!!</b> <br /><br />  Do you want to proceed?</>
            const result = await confirm(msg, optionsWithLabelChange);
            if (result) {
                axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'Sp_LM_Leaveapplication ', UpdateJson: JSON.stringify(Details) }).then(result => {
                    let msg = result.data.recordset[0][''];
                    if (msg === 'No Leaves') {
                        alert.success('Leave has been Applied successfully.');
                        setExpanded(-1);
                    } else {
                        confirm(<div className='alertBox'>{msg}</div>, { closeOnOverlayClick: false, labels: { confirmable: " Ok " } });
                    }
                });
            }

        }

        const handelClick = () => {
            if (parseInt(Data[expanded]['currentblc']) < parseInt(Details['NoOfDays'])) {
                handelApplyConfirm();
            } else {
                axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'Sp_LM_Leaveapplication ', UpdateJson: JSON.stringify(Details) }).then(result => {
                    let msg = result.data.recordset[0][''];
                    if (msg === 'No Leaves') {
                        alert.success('Leave has been Applied successfully.');
                        setExpanded(-1);
                    } else {
                        confirm(<div className='alertBox'>{msg}</div>, { closeOnOverlayClick: false, labels: { confirmable: " Ok " } });
                    }
                });
            }
        }
        const getBusinessDatesCount = (startDate, endDate) => {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
            let count = 0;
            let curDate = +startDate;
            //let holiDay = ComDate.filter((item) => { return item['Day'] !== "Sunday" && item['Day'] !== "Saturday" });
            while (curDate <= +endDate) {
                const dayOfWeek = new Date(curDate).getDay();
                const isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0);
                if (!isWeekend) {
                    count++;
                }
                curDate = curDate + 24 * 60 * 60 * 1000
            }
            return count;
        }
        const isDisable = () => {
            let isValidate = false;
            if (Details['Reason'] === '' || parseFloat(Details['NoOfDays']) === parseFloat(0) || (Details['LeaveOption'] === '2' && Details['Dates'] === '-1')) isValidate = true;
            return { disabled: isValidate };
        }
        return (
            <>
                <div id='LMS' style={{ margin: '15px 0 0 0', width: '99%' }}>
                    <div className="input-wrapper marginLeft-0 mWidth-190">
                        <div className="input-holder input-DatePicker">
                            <DatePicker name="startDate" showHoliDay={true} Value={new Date(Details['startDate'])} valueChange={handelOnChange} />
                            <label className="input-label">Start Date</label>
                        </div>
                    </div>

                    <div className="input-wrapper marginLeft-0 mWidth-190">
                        <div className="input-holder input-DatePicker">
                            <DatePicker name="endDate" showHoliDay={true} minDate_={new Date(Details['startDate'])} Value={new Date(Details['endDate'])} valueChange={handelOnChange} />
                            <label className="input-label">End Date</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0 mWidth-190">
                        <div className="input-holder">
                            <select className="input-input" name="Duration" disabled={Details['NoOfDays'] <= 1 && Details['NoOfDays'] !== 0 ? false : true} onChange={handelOnChange}>
                                {/* value={Details['Duration']}  */}
                                <option value="1">Full Day</option>
                                <option value="0.5">1st Half</option>
                                <option value="0.5">2nd Half</option>
                            </select>
                            <label className="input-label">Duration</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0 mWidth-190">
                        <div className="input-holder">
                            <input type="text" className="input-input" disabled name="NoOfDays" value={Details['NoOfDays']} onChange={handelOnChange} />
                            <label className="input-label">No.of Days</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <input type="text" className="input-input" name="Reason" placeholder="Enter Your Reason" value={Details['Reason']} onChange={handelOnChange} />
                            <label className="input-label">Reason</label>
                        </div>
                    </div>
                    <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <select className="input-input" name="LeaveOption" value={Details['LeaveOption']} onChange={handelOnChange}>
                                <option value="0">Deduct from my leave balance</option>
                                <option value="1">Compensate leave in upcoming week</option>
                                <option value="2">Use Previously Compensated working day</option>
                            </select>
                            <label className="input-label">Leave Option</label>
                        </div>
                    </div>
                    {isVisavle && <div className="input-wrapper marginLeft-0">
                        <div className="input-holder">
                            <select className="input-input" name="Dates" value={Details['Dates']} onChange={handelOnChange}>
                                {Option.length > 0 ? Option.map((item, index) => (
                                    <option key={index} value={item['Date_']}>{item['Date']}</option>
                                )) : <option value="-1" disabled >No Dates Available</option>}
                            </select>
                            <label className="input-label">Dates</label>
                        </div>
                    </div>}
                    <div>
                        <button className="btn" style={{ margin: '0' }} {...isDisable()} onClick={handelClick}>Apply</button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div id="LeaveBalance" style={{ width: '95%', border: '1px solid' + localStorage['BgColor'], borderTopRightRadius: '5px', borderTopLeftRadius: '5px' }}>
                <Accordion expanded={false} onChange={handleChange(-1)}>
                    <AccordionSummary style={{ color: localStorage['Color'], backgroundColor: localStorage['BgColor'], }}>
                        <Typography component={"span"} sx={{ width: '16%', flexShrink: 0 }}>
                            Leave Type
                        </Typography>
                        <Typography component={"span"} sx={{ width: '16%', flexShrink: 0 }}>
                            Opening Balance
                        </Typography>
                        <Typography component={"span"} sx={{ width: '16%', flexShrink: 0 }}>
                            Earned Leave
                        </Typography>
                        <Typography component={"span"} sx={{ width: '16%', flexShrink: 0 }}>
                            Availed/Approved
                        </Typography>
                        <Typography component={"span"} sx={{ width: '16%', flexShrink: 0 }}>
                            Current Balance
                        </Typography>
                        <Typography component={"span"} sx={{ width: '16%', flexShrink: 0 }}>
                            LOP
                        </Typography>
                    </AccordionSummary>

                </Accordion>

                {Data.map((column, index) => (
                    <Accordion key={index} expanded={expanded === index} className={expanded === index ? 'activeAcc' : ''} onChange={column['LeaveType'] === 'Total' ? handleChange(-1) : handleChange(index)} >
                        <AccordionSummary className={expanded === index ? 'activeAccSum' : ''}
                            expandIcon={column['LeaveType'] === 'Total' ? <></> : <ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography component={"span"} sx={{ width: `${column['LeaveType'] === 'Total' ? '16.2%' : '16.5%'}`, flexShrink: 0 }}>
                                {column['LeaveType']}
                            </Typography>
                            <Typography component={"span"} sx={{ width: `${column['LeaveType'] === 'Total' ? '16.2%' : '16.5%'}`, flexShrink: 0, padding: '0 30px' }}>
                                {column['OpeningBalance']}
                            </Typography>
                            <Typography component={"span"} sx={{ width: `${column['LeaveType'] === 'Total' ? '16.2%' : '16.5%'}`, flexShrink: 0, padding: '0 30px' }}>
                                {column['EarnedLeave']}
                            </Typography>
                            <Typography component={"span"} sx={{ width: `${column['LeaveType'] === 'Total' ? '16%' : '16.5%'}`, flexShrink: 0, padding: '0 30px' }}>
                                {column['LeavesTaken']}
                            </Typography>
                            <Typography component={"span"} sx={{ width: `${column['LeaveType'] === 'Total' ? '15.5%' : '16%'}`, flexShrink: 0, padding: '0 30px' }}>
                                {column['currentblc']}
                            </Typography>
                            <Typography component={"span"} sx={{ width: `${column['LeaveType'] === 'Total' ? '16%' : '16%'}`, flexShrink: 0, padding: '0 30px' }}>
                                {column['LOP']}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component={"span"}>
                                <LeaveApplyTab />
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </>
    );
}
