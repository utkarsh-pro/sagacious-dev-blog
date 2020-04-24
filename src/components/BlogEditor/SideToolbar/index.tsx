import React, { useState, useEffect } from 'react'
import Classes from './index.module.css'
import { ReactComponent as Plus } from '../../../assets/svg/plus.svg'

// ==================================== INTERFACE ===============================

export interface ToolbarConfig {
    editor: any;
    editorRef: any;
    children?: any
}

// ==================================== COMPONENT ===============================

function SideToolbar({ editor, editorRef }: ToolbarConfig) {
    // const position = useRef({ top: 0, left: 0 })
    const [position, setPostion] = useState({ top: 0, left: 0 })

    useEffect(() => {
        const selectionState = editor.getSelection()
        const start = selectionState.getStartKey();
        const currentContent = editor.getCurrentContent();
        const currentContentBlock = currentContent.getBlockForKey(start);

        const node = document.querySelectorAll(
            `[data-offset-key="${currentContentBlock.getKey()}-0-0"]`
        )[0];

        const editorRoot = editorRef.current.refs?.editor || editorRef.current.editor

        // console.log(
        //     (node as HTMLDivElement).offsetTop + (editorRoot as HTMLDivElement).offsetTop,
        //     (editorRoot as HTMLDivElement).offsetLeft - (16 * 5)
        // )

        // position.current.left = (editorRoot as HTMLDivElement).offsetLeft - (16 * 5)
        // position.current.top = (node as HTMLDivElement).offsetTop
        setPostion({
            left: (editorRoot as HTMLDivElement).offsetLeft - (16 * 5),
            top: (node as HTMLDivElement).offsetTop
        })

    }, [editor, editorRef])


    return (
        <div className={Classes.toolbarContainer} style={{ ...position }}>
            <div className={Classes.iconContainer}><Plus className={Classes.icon} /></div>
            <div className={Classes.drawer}></div>
        </div>
    )
}

export default SideToolbar
