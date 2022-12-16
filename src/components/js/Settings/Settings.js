import React, { useEffect, useState } from 'react';
import setTheme from '../../Sub-Component/setTheme';
import "../../../components/css/Settings.css"
import axios from 'axios';
import Male from '../../../images/Male.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faTrash } from '@fortawesome/free-solid-svg-icons';
import Female from '../../../images/Female.png'
import nodeurl from '../../../nodeServer.json'

export default function Settings() {
    const [isReload, setIsReload] = useState(false);
    const loadImage = () => {
        try {
            return require('\\image\\Profile_' + localStorage['EmpId'] + '.png')
        } catch (error) {
            return localStorage['Gender'] === 'Female' ? Female : Male
        }
    }
    //1f456e", "151e3d", "0589a0", "444791", "f48225", "428bca", "911844
    const Color = [
        { Primary: '#444791', Secondary: '#fff' },
        { Primary: '#151e3d', Secondary: '#fff' },
        { Primary: '#0589a0', Secondary: '#fff' },
        { Primary: '#f48225', Secondary: '#fff' },
        { Primary: '#428bca', Secondary: '#fff' },

        { Primary: '#911844', Secondary: '#fff' },
        { Primary: '#0d3560', Secondary: '#fff' },
        { Primary: '#6fbb80', Secondary: '#fff' },
        { Primary: '#e30b5d', Secondary: '#fff' },
        { Primary: '#111', Secondary: '#fff' },

        { Primary: '#82ade2', Secondary: '#111' },
        { Primary: '#4fb8c0', Secondary: '#111' },
        { Primary: '#ffcf05', Secondary: '#111' },
        { Primary: '#00bfff', Secondary: '#0c090a' },
        { Primary: '#673ab7', Secondary: '#fff' },

        { Primary: '#ff6f00', Secondary: '#111' },
        { Primary: '#f8bbd0', Secondary: '#111' },
        { Primary: '#8bc34a', Secondary: '#111' },
        { Primary: '#0288d1', Secondary: '#111' },
        { Primary: '#FF69B4', Secondary: '#111' },

        { Primary: '#FF6347', Secondary: '#111' },
        { Primary: '#BDB76B', Secondary: '#111' },
        { Primary: '#6A5ACD', Secondary: '#111' },
        { Primary: '#008080', Secondary: '#111' },
        { Primary: '#F08080', Secondary: '#111' },
    ];
    useEffect(() => { setTheme(); }, []);
    const imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            debugger
            if (reader.readyState === 2) {
                axios.post(nodeurl['nodeurl'] + 'Upload', { img: reader.result, EmpId: localStorage['EmpId'] }).then(result => {
                    setIsReload(!isReload);
                });
            }
        }
        reader.readAsDataURL(e.target.files[0])
    };
    const imagedeleteHandler = (e) => {
        axios.post(nodeurl['nodeurl'] + 'Delete', { EmpId: localStorage['EmpId'] }).then(result => {
            console.log("Image deleted");
            setIsReload(!isReload);
        });
    };
    const handelColorClick = (event) => {
        const color = Color[parseInt(event.currentTarget.attributes.index.value)];
        localStorage.setItem('BgColor', color['Primary']);
        localStorage.setItem('Color', color['Secondary']);
        setTheme();
    }
    const handelClick = () => {
        const color = localStorage['BgColor'] + ',' + localStorage['Color'];
        axios.post(nodeurl['nodeurl'], { query: "update EmployeeDetails set Theme='" + color + "' where Empid=" + localStorage["EmpId"] }).then(result => {
            console.log("Theme Saved");
        });
    }
    const getDesignation = () => {
        // <span className="profession" style={{ positio, top: '12%', left: '4%', fontSize: '20px' }}>{localStorage["Designation"]}</span>

        return (<><div style={{ padding: '0 15px' }}><span className="profession">{localStorage["Designation"].split('-')[0]}</span><br />
            {localStorage["Designation"].split('-')[1] && <span className="profession" >{localStorage["Designation"].split('-')[1]}</span>}
        </div></>);
    }
    return (
        <>
            <div className="page">
                <div className="container container_1" style={{ width: '30%', minWidth: '250px' }}>
                    <div className="img-holder">
                        <div className="Img-profile">
                            <img src={loadImage()} alt="" id="img" className="img" />
                            <div className='img-up'>
                                <label className="image-upload choosephoto" htmlFor="input">
                                    <FontAwesomeIcon icon={faUpload} className="icon" />
                                </label>
                                <label className="image-upload choosephoto" onClick={imagedeleteHandler}>
                                    <FontAwesomeIcon icon={faTrash} className="icon" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="heading">{localStorage['Name']}</h1>
                        {getDesignation()}
                    </div>
                    <input type="file" accept="image/png" name="image-upload" id="input" onChange={imageHandler} />
                    <div className="label">

                    </div>
                    <div style={{ margin: '20% 0 0 4%' }}>
                        {Color.map((color, index) => {
                            return (<div key={index} className='colorPaletteWrapper' >
                                <div className='colorPalette col-sm' onClick={handelColorClick} index={index} style={{ backgroundColor: color['Primary'], border: '2px solid' + color['Primary'] }}>
                                    <div className='primary'></div>

                                    <div className='secondary' style={{ backgroundColor: color['Secondary'] }}></div>
                                </div>
                            </div>)
                        })}
                        <div style={{ marginTop: '30px' }}>
                            <button id='applybtn' className="btn" style={{ float: 'right' }} onClick={handelClick}>Apply</button>
                        </div>
                    </div>

                </div>


                {/* <div className="container container_2" style={{ minWidth: '400px', textAlign: 'center' }}> */}

                {/* </div> */}
            </div>
        </>
    );

}


