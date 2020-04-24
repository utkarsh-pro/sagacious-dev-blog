import React, { useState, useEffect } from 'react'
import Classes from './index.module.css'

/**
 * @returns The selected area
 */
const getVisibleSelectionRect = () => {
    const selection = window.getSelection()?.getRangeAt(0).getClientRects()
    let target: any = null;

    if (selection?.length) {
        if (selection[0].width === 0)
            target = selection[1]
        else
            target = selection[0]
    }

    return target
}

// ==================================== INTERFACE ===============================

export interface ToolbarConfig {
    editor: any;
    editorRef: any;
    children?: any
}

// ==================================== COMPONENT ===============================

const initialPosition = { top: -100, left: -100 }

function InlineToolbar({ editor, editorRef }: ToolbarConfig) {
    const [position, setPostion] = useState(initialPosition)

    useEffect(() => {
        const selectionState = editor.getSelection()

        if (!selectionState.isCollapsed()) {
            const editorRoot = editorRef.current.refs?.editor || editorRef.current.editor

            const editorRootRect = editorRoot.getBoundingClientRect();
            const selectionRect = getVisibleSelectionRect();

            if (!selectionRect) return;

            // The toolbar shouldn't be positioned directly on top of the selected text,
            // but rather with a small offset so the caret doesn't overlap with the text.
            const extraTopOffset = -5;

            console.log(selectionRect)

            setPostion({
                top:
                    editorRoot.offsetTop +
                    (selectionRect.top - editorRootRect.top) +
                    extraTopOffset,
                left:
                    editorRoot.offsetLeft +
                    (selectionRect.left - editorRootRect.left) +
                    selectionRect.width / 2,
            });

        } else {
            setPostion(initialPosition)
        }

    }, [editor, editorRef])


    return (
        <div className={Classes.toolbarContainer} style={{ ...position }}>

        </div>
    )
}

export default InlineToolbar
