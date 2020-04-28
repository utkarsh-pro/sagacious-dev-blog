import React, { useState, useCallback, useRef } from 'react'
import Classes from './index.module.css'

import {
    Editor as DraftEditor,
    EditorState,
    AtomicBlockUtils,
    RichUtils,
    getDefaultKeyBinding,
    convertFromRaw,
    convertToRaw,
    ContentState
} from 'draft-js'
import 'draft-js/dist/Draft.css'

import Editor from '../Editor';
import SideToolbar from './SideToolbar'
import InlineToolbar from './InlineToolbar'
import { getNodeFromKey } from './utility';
import Button from '../Button';

// ====================================================================================================

export interface IBlogEditor {
    readonly?: boolean;
    content?: string;
}

// =====================================================================================================

const EditorWrapper = (props: any) => {
    const { blockProps } = props;
    return (
        <Editor
            header
            footer
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
        case "ordered-list-item":
            return Classes.editorOL;
        case "unordered-list-item":
            return Classes.editorUL;
        case "atomic":
            return Classes.editorAtomic;
        default:
            return Classes.editorText
    }
}

const saveToLocalStorage = (data: ContentState) => {
    const rawData = convertToRaw(data)
    const jsonSerialised = JSON.stringify(rawData)
    window.localStorage.setItem("article", jsonSerialised)
}

const getContentBlock = (content: string) => {
    return convertFromRaw(JSON.parse(content))
}

// =====================================================================================================

function BlogEditor({ readonly, content }: IBlogEditor) {

    const [state, setState] = useState(
        !content ? EditorState.createEmpty() : EditorState.createWithContent(getContentBlock(content))
    )

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

    const memoizedSaveToStorageFn = useCallback(() => {
        const content = state.getCurrentContent()
        saveToLocalStorage(content)
    }, [state])

    const retreiveFromMemory = () => {
        const rawDataString = window.localStorage.getItem("article")
        if (rawDataString) {
            const rawData = JSON.parse(rawDataString)
            const contentState = convertFromRaw(rawData)
            setState(EditorState.createWithContent(contentState))
        }
    }

    const toggleInlineStyle = (inlineStyle: string) => {
        setState(RichUtils.toggleInlineStyle(state, inlineStyle))
    }

    const toggleBlockType = (blockType: string) => {
        if (blockType !== "atomic")
            setState(RichUtils.toggleBlockType(state, blockType));

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
                const monaocoParent = getNodeFromKey(monacoKey);

                const divReferenceToMonaocParent = (monaocoParent as HTMLDivElement);

                divReferenceToMonaocParent.contentEditable = "false"
            }, 0)
        }
    }

    const onChangeHandler = (state: EditorState) => setState(state)
    const focus = () => {
        if (!readonly) DraftRef.current?.focus()
    }

    const handleKeyCommand = (command: string, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setState(newState);
            return true;
        }
        return false;
    }

    const mapKeyToEditorCommand = (e: any) => {
        if (e.keyCode === 9 /* TAB */) {
            console.log("Here")
            const newEditorState = RichUtils.onTab(
                e,
                state,
                8, /* maxDepth */
            );
            if (newEditorState !== state) {
                setState(newEditorState);
            }
            return;
        }

        return getDefaultKeyBinding(e);
    }

    return (
        <div className={Classes.container}>
            <div className={Classes.editor} onClick={focus}>
                {!readonly && <SideToolbar editor={state} editorRef={DraftRef} toggleBlockStyle={toggleBlockType} />}
                {!readonly && <InlineToolbar editor={state} editorRef={DraftRef} toggleInlineStyle={toggleInlineStyle} />}
                {/* Adding this because of incompatible types
                // @ts-ignore */}
                <DraftEditor
                    spellCheck
                    ref={DraftRef}
                    readOnly={readonly || editorIsUp}
                    editorState={state}
                    onChange={onChangeHandler}
                    blockStyleFn={blockStyleFn}
                    keyBindingFn={mapKeyToEditorCommand}
                    handleKeyCommand={handleKeyCommand}
                    blockRendererFn={memoizedBockRendererFn} />
            </div>
            {!readonly && <Button name="Save" onClick={memoizedSaveToStorageFn} className={Classes.btn} />}
            {!readonly && <Button name="Load from Memory" onClick={retreiveFromMemory} className={Classes.btn} />}
        </div>
    );
}

export default BlogEditor
