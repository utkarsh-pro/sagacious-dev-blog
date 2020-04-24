import React, { useState, useCallback, useRef } from 'react'
import Classes from './index.module.css'

import { Editor as DraftEditor, EditorState, AtomicBlockUtils, RichUtils } from 'draft-js'

import Editor from '../Editor';
import SideToolbar from './SideToolbar'
import InlineToolbar from './InlineToolbar'
import { getNodeFromKey } from './utility';

// =====================================================================================================

const EditorWrapper = (props: any) => {
    const { blockProps } = props;
    return (
        <Editor
            onBlur={() => blockProps.setEditorIsUp(false)}
            onFocus={() => blockProps.setEditorIsUp(true)}
            language={blockProps.language}
            height={blockProps.height} />)
}

// ====================================================================================================

const blockStyleFn = (ContentBlock: any) => {
    const type = ContentBlock.getType();
    switch (type) {
        case "header-one":
            return Classes.editorH1;
        case "header-two":
            return Classes.editorH2;
        case "blockquote":
            return Classes.editorBlockquote;
        default:
            return Classes.editorText
    }
}

// =====================================================================================================

function BlogEditor() {

    const [state, setState] = useState(EditorState.createEmpty())
    const [editorIsUp, setEditorIsUp] = useState(false)

    const DraftRef = useRef<DraftEditor>(null)

    const memoizedBockRendererFn = useCallback((block) => {
        const type = block.getType();
        if (type === "atomic") {
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

    const toggleInlineStyle = (inlineStyle: string) => {
        onChangeHandler(RichUtils.toggleInlineStyle(state, inlineStyle))
    }

    const toggleBlockStyle = (blockType: string) => {
        if (blockType !== "atomic")
            onChangeHandler(RichUtils.toggleBlockType(state, blockType));

        else {
            // Add Monaco editor to the current state
            const contentState = state.getCurrentContent()
            const contentStateWithEntity = contentState.createEntity("MONACO", "MUTABLE");
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newEditorState = EditorState.set(
                state,
                { currentContent: contentStateWithEntity }
            );
            const newState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, "")
            setState(newState)

            // Get a reference to monaco instance
            const newContentState = newState.getCurrentContent();
            const draftKey = newContentState.getLastBlock().getKey()
            const monacoKey = newContentState.getKeyBefore(draftKey)


            // Get the monaco node
            // This is done asynchronously because
            // There is usually a delay between block rendering by
            // Draft js
            setTimeout(() => {
                console.log("Entity Key:", monacoKey)
                const monaocoParent = getNodeFromKey(monacoKey);

                const divReferenceToMonaocParent = (monaocoParent as HTMLDivElement);

                divReferenceToMonaocParent.contentEditable = "false"
                divReferenceToMonaocParent.style.marginLeft = "0"
                divReferenceToMonaocParent.style.marginRight = "0"

            }, 0)
        }
    }

    const onChangeHandler = (state: EditorState) => setState(state)
    const focus = () => DraftRef.current?.focus()

    return (
        <div className={Classes.container}>
            <div className={Classes.editor} onClick={focus}>
                <DraftEditor
                    ref={DraftRef}
                    readOnly={editorIsUp}
                    editorState={state}
                    onChange={onChangeHandler}
                    blockStyleFn={blockStyleFn}
                    blockRendererFn={memoizedBockRendererFn} />
            </div>
            <SideToolbar editor={state} editorRef={DraftRef} toggleBlockStyle={toggleBlockStyle} />
            <InlineToolbar editor={state} editorRef={DraftRef} toggleInlineStyle={toggleInlineStyle} />

            <div onClick={() => console.log(state.toJS())}>Get the Data (See Console)</div>
        </div>
    );
}

export default BlogEditor
