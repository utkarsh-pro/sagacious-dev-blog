import React, { useState, useEffect } from 'react'
import Classes from './index.module.css'
import { ReactComponent as Plus } from '../../../assets/svg/plus.svg'
import { ReactComponent as H1 } from '../../../assets/svg/heading.svg'
import { ReactComponent as H2 } from '../../../assets/svg/subheading.svg'
import { ReactComponent as Blockquote } from '../../../assets/svg/blockquote.svg'
import { ReactComponent as UL } from '../../../assets/svg/unorderedlist.svg'
import { ReactComponent as OL } from '../../../assets/svg/orderedlist.svg'
import { ReactComponent as Code } from '../../../assets/svg/code.svg'
import { getNodeFromKey } from '../utility'

// ==================================== INTERFACE ===============================

export interface ToolbarConfig {
    editor: any;
    editorRef: any;
    toggleBlockStyle?: (blockType: string) => void;
    children?: any
}

interface IStyleButton {
    onToggle: (style: string) => void;
    active: boolean;
    style: string;
    label: JSX.Element;
}

// ==================================== HELPER COMPONENT ========================

const StyleButton = ({ onToggle, active, style, label }: IStyleButton) => {

    const onToggleHandler = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault();
        onToggle(style);
    };

    let className = Classes.styleButton;
    if (active) {
        className += " " + Classes.activeButton;
    }

    return (
        <span className={className} onMouseDown={onToggleHandler}>
            {label}
        </span>
    );

}

const BLOCK_TYPES = [
    { label: <H1 className={Classes.icon} />, style: 'header-one' },
    { label: <H2 className={Classes.icon} />, style: 'header-two' },
    { label: <Blockquote className={Classes.icon} />, style: 'blockquote' },
    { label: <UL className={Classes.icon} />, style: 'unordered-list-item' },
    { label: <OL className={Classes.icon} />, style: 'ordered-list-item' },
    { label: <Code className={Classes.icon} />, style: 'atomic' },
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
            {BLOCK_TYPES.map((type, idx) =>
                <StyleButton
                    key={`${type.style}-${idx}`}
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

        const node = getNodeFromKey(currentContentBlock.getKey())

        const editorRoot = editorRef.current.refs?.editor || editorRef.current.editor

        // console.log(
        //     (node as HTMLDivElement).offsetTop + (editorRoot as HTMLDivElement).offsetTop,
        //     (editorRoot as HTMLDivElement).offsetLeft - (16 * 5)
        // )

        // position.current.left = (editorRoot as HTMLDivElement).offsetLeft - (16 * 5)
        // position.current.top = (node as HTMLDivElement).offsetTop
        setPostion({
            left: (editorRoot as HTMLDivElement).offsetLeft - (16 * 5),
            top: (node as HTMLDivElement).offsetTop + ((node as HTMLDivElement).clientHeight / 2)
        })

    }, [editor, editorRef])


    return (
        <div className={Classes.toolbarContainer} style={{ ...position }}>
            <div className={Classes.iconContainer} onClick={() => setShow(!show)}>
                <Plus className={Classes.plusIcon} />
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
