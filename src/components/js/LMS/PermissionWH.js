import React, { useState, } from 'react';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json'
import Moment from 'moment';
import DatePicker from '../../Sub-Component/DatePicker/DatePicker';
import { useAlert } from "react-alert";
import { confirm } from "react-confirm-box";

export default function PermissionWH() {
    const EmpId = localStorage['EmpId'];
    const alert = useAlert();
    const [DetailsWH, setDetailsWH] = useState({ EmpId: EmpId, StartDate: Moment(new Date()).format('MM-DD-YYYY'), EndDate: Moment(new Date()).format('MM-DD-YYYY'), From: '09.00', To: '09.30', Duration: 0, TotalHours: '00.30', Reason: '', PermissionID: 1 })
    const TimeArr = [
        { value: "09.00", text: "09.00" }, { value: "09.30", text: "09.30" }, { value: "10.00", text: "10.00" }, { value: "10.30", text: "10.30" },
        { value: "11.00", text: "11.00" }, { value: "11.30", text: "11.30" }, { value: "12.00", text: "12.00" }, { value: "12.30", text: "12.30" },
        { value: "13.00", text: "13.00" }, { value: "13.30", text: "13.30" }, { value: "14.00", text: "14.00" }, { value: "14.30", text: "14.30" },
        { value: "15.00", text: "15.00" }, { value: "15.30", text: "15.30" }, { value: "16.00", text: "16.00" }, { value: "16.30", text: "16.30" },
        { value: "17.00", text: "17.00" }, { value: "17.30", text: "17.30" }, { value: "18.00", text: "18.00" }, { value: "18.30", text: "18.30" },
        { value: "19.00", text: "19.00" }, { value: "19.30", text: "19.30" }
    ];
    const optionsWithLabelChange = {
        closeOnOverlayClick: true,
        labels: {
            confirmable: "Confirm",
            cancellable: "Cancel"
        }
    };
    let ToOption = TimeArr;
    ToOption = TimeArr.slice(TimeArr.findIndex(x => x.value === DetailsWH['From']) + 1, TimeArr.findIndex(x => x.value === DetailsWH['From']) + 5);

    const handelConfirm = async (msg) => {
        if (await confirm(msg, optionsWithLabelChange)) {
            handelSave();
        }
    }
    const handelSave = () => {
        axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'LM_PM_PermissionApply ', UpdateJson: JSON.stringify(DetailsWH) }).then(result => {
            // let status = result.data[0];
            // if (status === 1) 
            alert.show("Permission has been Applied successfully.");
        });
    }
    const handelClick = async () => {
        axios.post(nodeurl['nodeurl'] + 'Update', { SP: 'LM_PM_PermissionLimitCheck ', UpdateJson: JSON.stringify({ EmpId: EmpId, StartDate: DetailsWH['StartDate'] }) }).then(result => {
            if (result.data.recordset[0].Count >= 3) {
                handelConfirm(result.data.recordset[0].Msg);
            } else {
                handelSave();
            }
        });

    }
    const handelOnChange = (event) => {
        if (event.target.name === 'StartDate') DetailsWH['EndDate'] = event.target.value;
        if (event.target.name === 'From') DetailsWH['TotalHours'] = '00.30';
        if (event.target.name === 'To') DetailsWH['TotalHours'] = (((parseFloat(event.target.value)) - parseFloat(DetailsWH['From'])).toFixed(2)).replace('.7', '.3');
        setDetailsWH({ ...DetailsWH, [event.target.name]: event.target.value });
    }
    const isDisable = () => {
        let isValidate = false;
        if (DetailsWH['Reason'] === '') isValidate = true;
        return { disabled: isValidate };
    }

    return (
        <div style={{ width: '99%', height: '60vh' }}>
            <div className="input-wrapper marginLeft-0">
                <div className="input-holder input-DatePicker">
                    <DatePicker name="StartDate" showHoliDay={true} Value={new Date(DetailsWH['StartDate'])} valueChange={handelOnChange} />
                    <label className="input-label">Date</label>
                </div>
            </div>

            <div className="input-wrapper marginLeft-0">
                <div className="input-holder">
                    <select className="input-input" name="From" value={DetailsWH['From']} onChange={handelOnChange}>
                        {TimeArr.map((item, index) => (
                            <option key={index} value={item['value']}>{item['text']}</option>
                        ))}
                    </select>
                    <label className="input-label">From</label>
                </div>
            </div>
            <div className="input-wrapper marginLeft-0">
                <div className="input-holder">
                    <select className="input-input" name="To" value={DetailsWH['To']} onChange={handelOnChange}>
                        {ToOption.map((item, index) => (
                            <option key={index} value={item['value']}>{item['text']}</option>
                        ))}
                    </select>
                    <label className="input-label">To</label>
                </div>
            </div>
            <div className="input-wrapper marginLeft-0">
                <div className="input-holder">
                    <input type="text" className="input-input" name="TotalHours" disabled value={DetailsWH['TotalHours']} onChange={handelOnChange} />
                    <label className="input-label">Total Hours</label>
                </div>
            </div>

            <div className="input-wrapper marginLeft-0">
                <div className="input-holder">
                    <input type="text" className="input-input" name="Reason" value={DetailsWH['Reason']} onChange={handelOnChange} />
                    <label className="input-label">Reason</label>
                </div>
            </div>

            <div>
                <button className="btn marginLeft-0" {...isDisable()} onClick={handelClick}>Apply</button>
            </div>
        </div>
    );
}
