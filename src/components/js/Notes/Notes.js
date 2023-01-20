import React from 'react';
import axios from 'axios';
import nodeurl from '../../../nodeServer.json';
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { useEffect } from 'react';
import Moment from 'moment';
import DatePicker from '../../Sub-Component/DatePicker/DatePicker';
import setTheme from '../../Sub-Component/setTheme';
import { useState } from 'react';
import { useAlert } from "react-alert";

const Note = props => {
    const alert = useAlert();
    const [Date_, setDate] = useState(Moment(new Date()).format('DD-MM-YYYY'));
    const [Notes, setNotes] = useState('');
    const EmpId = localStorage['EmpId'];
    useEffect(() => {
        axios.post(nodeurl['nodeurl'], { query: "SELECT ISNULL(Notes,'') Notes from Notes WHERE EmpId=" + EmpId + " AND [Date] ='" + Date_ + "'" }).then(result => {
            if (result.data[0].length !== 0) {
                setNotes(result.data[0][0]['Notes']);
            }
        });
        setTheme();
    }, [Date_]);
    const handleChange = (content) => {
        setNotes(content);
    }
    const handleSave = () => {
        axios.post(nodeurl['nodeurl'], { query: "LM_SaveNotes " + EmpId + ",'" + Date_ + "','" + Notes + "'" }).then(result => {
            alert.show('Notes Saved Successfully.');
        });
    }
    return (
        <div className='notesWrapper'>
            <div className='notesTitle'>
                Notes
                <div className="input-wrapper notesDate" style={{ width: '15%', marginTop: '-3px', float: 'right', height: '22px' }} >
                    <div className="input-holder">
                        <DatePicker name="notesDate" showHoliDay={true} isWeekEndDisable={false} Value={new Date()} valueChange={(e) => {
                            setDate(Moment(e.target.value).format('DD-MM-YYYY'));
                            axios.post(nodeurl['nodeurl'], { query: "SELECT ISNULL(Notes,'') Notes from Notes WHERE EmpId=" + EmpId + " AND [Date] ='" + Moment(e.target.value).format('DD-MM-YYYY') + "'" }).then(result => {
                                if (result.data[0].length !== 0)
                                    setNotes(result.data[0][0]['Notes']);
                                else
                                    setNotes('');
                            });
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
            <button className="btn marginRight-0 marginLeft-0" style={{ float: 'right' }} onClick={handleSave}>Save Notes</button>
        </div>

    );
};
export default Note;