import React, { useState } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Moment from 'moment';

export default function InputDatePicker(props) {
    const [date, setDate] = useState(new Date(props['Value']));
    const valueChange = props['valueChange'];
    const minDate = props['minDate_'] || null;
    const maxDate = props['maxDate'] || null;
    alert(maxDate)
    const handelDateChange = (value, e) => {
        var text = Moment(value).format('MM-DD-YYYY').toString();
        setDate(value);
        valueChange({ target: { name: props['name'], value: text } })
    }
    return (
        <>
            <Calendar className='input-Date'
                date={date}
                color={localStorage['BgColor']}
                onChange={handelDateChange}
                minDate={minDate}
                maxDate={maxDate}
            />
        </>
    )

}
