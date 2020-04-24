import React, { useState, useEffect } from 'react'
import Classes from './index.module.css'
import { ReactComponent as Plus } from '../../../assets/svg/plus.svg'

// ==================================== INTERFACE ===============================

export interface ToolbarConfig {
    editor: any;
    editorRef: any;
    toggleBlockStyle?: (blockType: string) => void;
    children?: any
}
// ==================================== HELPER COMPONENT ========================

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

const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'atomic' },
];

const BlockStyleControls = (props: any) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className={Classes.controls}>
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};
// ==================================== COMPONENT ===============================

function SideToolbar({ editor, editorRef, toggleBlockStyle }: ToolbarConfig) {
    // const position = useRef({ top: 0, left: 0 })
    const [position, setPostion] = useState({ top: 0, left: 0 })
    const [show, setShow] = useState(false);

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
            <div className={Classes.iconContainer} onClick={() => setShow(!show)}>
                <Plus className={Classes.icon} />
            </div>
            <div className={`${Classes.drawer} ${!show ? Classes.hide : Classes.show}`}>
                <BlockStyleControls
                    editorState={editor}
                    onToggle={(blockStyle: string) => {
                        toggleBlockStyle && toggleBlockStyle(blockStyle);
                        setShow(false)
                    }} />
            </div>
        </div>
    )
}

export default SideToolbar
