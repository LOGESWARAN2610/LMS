import React from 'react';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { useEffect } from 'react';
import Moment from 'moment';
import DatePicker from '../../Sub-Component/DatePicker/DatePicker';
import setTheme from '../../Sub-Component/setTheme';
import { useState } from 'react';
import { useAlert } from "react-alert";
import { confirm } from "react-confirm-box";
import Multiselect from 'multiselect-react-dropdown';

const Note = props => {
    const alert = useAlert();
    const [Date_, setDate] = useState(Moment(new Date()).format('YYYY-MM-DD'));
    const [Notes, setNotes] = useState('');
    const EmpId = localStorage['EmpId'];
    const [option, setOption] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [employeeListOpen, setEmployeeListOpen] = useState(false);

    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: "SELECT ISNULL(Notes,'') Notes,'1' from Notes WHERE EmpId=" + EmpId + " AND [Date] ='" + Date_ + "'" }).then(result => {
            if (result.data[0].length !== 0)
                setNotes(result.data[0][0]['Notes']);
            else
                setNotes('');
        });
    }, [Date_, EmpId]);
    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: "Select ISNULL(FirstName,'')+' '+ISNULL(LastName,'') AS Value,EmpId AS EmpId from EmployeeDetails WHERE Active = 1 ORDER BY FirstName " }).then(result => {
            let option_ = result.data[0];
            option_ = option_.map((item, index) => {
                return { name: item['Value'], Id: item['EmpId'] };
            });
            setOption(option_);
        });
        setTheme();
    });
    const handleChange = (content) => {
        setNotes(content);
    }
    const handleSave = () => {
        axios.post(nodeurl['nodeurl'], { query: "LM_SaveNotes " + EmpId + ",'" + Date_ + "','" + Notes + "'" }).then(result => {
            alert.show('Notes Saved Successfully.');
        });
    }

    const onMultiSelect = (selectedVal, value) => {
        selectedVal = selectedVal.map((item) => { return item['Id'] });
        selectedVal = selectedVal.join(',');
        setEmployee(selectedVal);
    }
    const handleSend = async () => {
        setEmployeeListOpen(!employeeListOpen);
        axios.post(nodeurl['nodeurl'], { query: "SELECT ISNULL(Notes,'') Notes from Notes WHERE [Date] = '" + Moment(new Date(Date_)).format('YYYY-MM-DD') + "' AND EmpId =" + EmpId }).then(async result => {
            // let Count = parseInt(result.data[0][0]['Count']);
            let Notes_ = '';
            if (result.data[0].length > 0)
                Notes_ = result.data[0][0]['Notes'];
            let html = <><h2>Confirmation</h2><div><b>
                {Notes_ === '' ? 'Your Notes not saved for the date.' : 'You have already saved for the date.'}
            </b><br />Select Your Option!</div></>
            let opt = { closeOnOverlayClick: false, labels: { confirmable: `${Notes_ === '' ? 'Save' : 'Update'} and Send`, cancellable: `Send without ${Notes_ === '' ? 'Save' : 'Update'}` } }
            if (true) {
                if (await confirm(html, opt)) {
                    SendNotes(true)
                } else {
                    SendNotes(false)
                }
            }
        });
    }

    const SendNotes = (flag) => {
        axios.post(nodeurl['nodeurl'], { query: "LM_SendNotes " + EmpId + ",'" + employee + "'," + flag + ",'" + Date_ + "','" + Notes + "'" }).then(result => {
            alert.show('Notes Send Successfully.');
        });
    }
    return (
        <div className='notesWrapper'>
            <div className='notesTitle'>
                Notes
                <div className="input-wrapper notesDate" style={{ width: '15%', marginTop: '-3px', float: 'right', height: '22px' }} >
                    <div className="input-holder">
                        <DatePicker name="notesDate" showHoliDay={true} isWeekEndDisable={false} Value={new Date()} valueChange={(e) => {
                            setDate(Moment(e.target.value).format('YYYY-MM-DD'));
                        }} />
                    </div>
                </div>
            </div>
            <SunEditor
                placeholder="Please type your Notes..."
                onChange={handleChange}
                setContents={Notes}
                setDefaultStyle="font-size: 15px;"
                setOptions={{
                    buttonList: [
                        ["undo", "redo"],
                        ["font", "fontSize", "formatBlock"],
                        ["bold", "underline", "italic", "strike", "subscript", "superscript"],
                        ["removeFormat"],
                        ["fontColor", "hiliteColor"],
                        ["outdent", "indent"],
                        ["align", "horizontalRule", "list", "table"],
                        ["link"],//, "image", "video"
                        ["fullScreen", "showBlocks", "codeView"],
                        // ["preview", "print"],
                        // ["save", "template"]
                    ]
                }}
            />
            {employeeListOpen && <div>
                <div className="confirm-box">
                    <div className="confirm-box__content">
                        <h2>Select name to send</h2>
                        <Multiselect
                            className="employeeSelect"
                            options={option}
                            onSelect={onMultiSelect}
                            onRemove={onMultiSelect}
                            displayValue="name" />
                        <div className="confirm-box__actions">
                            <button role='confirmable-button' onClick={handleSend}>Send</button>
                            <button role='cancellable-button' onClick={() => { setEmployeeListOpen(false) }}>Cancel</button>
                        </div>
                    </div>
                    <div class="confirm-box__overlay"></div>
                </div>
            </div>}
            <button className="btn marginRight-0" style={{ float: 'right' }} onClick={handleSave}>Save Notes</button>
            <button className="btn marginRight-0" style={{ float: 'right' }} onClick={() => { setEmployeeListOpen(true) }}>Send Notes</button>
        </div>

    );
};
export default Note;