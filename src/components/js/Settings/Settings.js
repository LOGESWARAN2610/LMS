import React, { useState, useEffect } from 'react';
import setTheme from '../../Sub-Component/setTheme';
import "../../../components/css/Settings.css"
import axios from 'axios';
import Male from '../../../images/Male.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Female from '../../../images/Female.png'
import nodeurl from '../../../nodeServer.json'
import { faUpload } from '@fortawesome/free-solid-svg-icons';

export default function Settings() {
    const loadImage = () => {
        try {
            return require('../../../images/Profile_' + localStorage['EmpId'] + '.png')
        } catch (error) {
            return localStorage['Gender'] === 'Female' ? Female : Male
        }
    }
    useEffect(() => { setTheme(); }, []);
    const imageHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                axios.post(nodeurl['nodeurl'] + 'Upload', { img: reader.result, EmpId: localStorage['EmpId'] }).then(result => {
                });
            }
        }
        reader.readAsDataURL(e.target.files[0])
    };

    return (
        <div className="page">
            <div className="container">
                <h1 className="heading">{localStorage['Name']}</h1>
                <div className="img-holder">
                    <img src={loadImage()} alt="" id="img" className="img" />
                </div>
                <input type="file" accept="image/png" name="image-upload" id="input" onChange={imageHandler} />
                <div className="label">
                    <label className="image-upload choosephoto" htmlFor="input">
                        Choose your Photo
                        <FontAwesomeIcon icon={faUpload} className="icon" />
                    </label>
                </div>
            </div>
        </div>
    );

}


