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
    toggleInlineStyle?: (inlineStyle: string) => void;
    children?: any
}

// ==================================== HELPER COMPONENT =======================
const StyleButton = (props: any) => {

    const onToggle = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault();
        props.onToggle(props.style);
    };

    let className = Classes.styleButton;
    if (props.active) {
        className += " " + Classes.activeButton;
    }

    return (
        <span className={className} onMouseDown={onToggle}>
            {props.label}
        </span>
    );

}

const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' }
];

const InlineStyleControls = (props: any) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div className={Classes.controls}>
            {INLINE_STYLES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

// ==================================== CONSTANTS ===============================

const initialPosition = { top: -100, left: -100 }

// ==================================== COMPONENT ===============================

function InlineToolbar({ editor, editorRef, toggleInlineStyle }: ToolbarConfig) {
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


            setPostion({
                top:
                    editorRoot.offsetTop +
                    (selectionRect.top - editorRootRect.top),

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
            {
                position.top !== initialPosition.top
                &&
                <InlineStyleControls editorState={editor} onToggle={toggleInlineStyle} />
            }
        </div>
    )
}

export default InlineToolbar
