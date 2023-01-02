import React, { Component } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useState } from 'react';
import { useEffect } from 'react';
import setTheme from '../../Sub-Component/setTheme';


export default function Notes() {
    const [editorState, setEditorState] = useState();
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    };
    useEffect(() => {
        setTheme();
    });
    return (
        <div className='notesWrapper'>
            <div className='notesTitle'>
                Notes
            </div>
            <Editor
                editorState={editorState}
                // wrapperClassName="wrapper-class"
                // editorClassName="editor-class"
                // toolbarClassName="toolbar-class"
                // wrapperStyle={<wrapperStyleObject>}
                // editorStyle={<editorStyleObject>}
                // toolbarStyle={<toolbarStyleObject>}
                onEditorStateChange={onEditorStateChange}
            />
        </div>
    );
}