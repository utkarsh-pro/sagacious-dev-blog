import React, { useState, useCallback, useRef } from 'react'
import Classes from './index.module.css'

import { Editor as DraftEditor, EditorState, AtomicBlockUtils } from 'draft-js'

import Editor from '../Editor';
import SideToolbar from './SideToolbar'
import InlineToolbar from './InlineToolbar'

const EditorWrapper = (props: any) => {
    const { blockProps } = props;
    return (
        <Editor
            onBlur={() => blockProps.setEditorIsUp(false)}
            onFocus={() => blockProps.setEditorIsUp(true)}
            language={blockProps.language}
            height={blockProps.height} />)
}

function BlogEditor() {

    const [state, setState] = useState(EditorState.createEmpty())
    const [editorIsUp, setEditorIsUp] = useState(false)

    const DraftRef = useRef<DraftEditor>(null)

    const memoizedBockRendererFn = useCallback((block) => {
        const type = block.getType();
        if (type === "atomic") {
            console.log(block)
            return {
                component: EditorWrapper,
                editable: true,
                props: {
                    language: 'javascript',
                    height: "20rem",
                    setEditorIsUp
                }
            }
        }
    }, [])

    return (
        <div className={Classes.container}>
            <div className={Classes.editor} onClick={() => DraftRef.current?.focus()}>
                <DraftEditor
                    ref={DraftRef}
                    readOnly={editorIsUp}
                    editorState={state}
                    onChange={setState}
                    blockRendererFn={memoizedBockRendererFn} />
            </div>
            <SideToolbar editor={state} editorRef={DraftRef} />
            <InlineToolbar editor={state} editorRef={DraftRef} />
            <div onClick={() => {
                const contentState = state.getCurrentContent()
                const contentStateWithEntity = contentState.createEntity("MONACO", "MUTABLE");
                const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                const newEditorState = EditorState.set(
                    state,
                    { currentContent: contentStateWithEntity }
                );
                setState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ""))

            }}>CLICK</div>
            <div onClick={() => console.log(state.toJS())}>Get the Data (See Console)</div>
        </div>
    );
}

export default BlogEditor
