import React, { useState, useCallback, useRef } from 'react'
import CodeEditorWrapper from './CodeEditorWrapper'
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

// Don't remove this! Check https://draftjs.org/docs/advanced-topics-issues-and-pitfalls#missing-draftcss
import 'draft-js/dist/Draft.css'

import SideToolbar from './SideToolbar'
import InlineToolbar from './InlineToolbar'
import { getNodeFromKey } from './utility';
import Button from '../Button';

// ======================================== INTERFACES =============================================

/**
 * Interface for BlogEditor
 */
export interface IBlogEditor {
    readonly?: boolean;
    content?: string;
}

// ========================================= HELPER FUNCTIONS =======================================

/**
 * Assigns custom classes to the draft js blocks
 * @param ContentBlock 
 */
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

/**
 * Converts the javascript state object into JSON
 * and then stores it in the localstorage
 * @param data 
 */
const saveToLocalStorage = (data: ContentState) => {
    const rawData = convertToRaw(data)
    const jsonSerialised = JSON.stringify(rawData)
    window.localStorage.setItem("article", jsonSerialised)
}

/**
 * Receives the JSON object in string format
 * Parses it into object and the converts it into
 * a draft.js contentBlock
 * @param content 
 */
const getContentBlock = (content: string) => {
    return convertFromRaw(JSON.parse(content))
}

// =====================================================================================================

function BlogEditor({ readonly, content }: IBlogEditor) {

    /**
     * Stores the state of the editor
     */
    const [state, setState] = useState(
        !content ? EditorState.createEmpty() : EditorState.createWithContent(getContentBlock(content))
    )

    /**
     * Stores the state if the code editor is active or not 
     */
    const [editorIsUp, setEditorIsUp] = useState(false)

    /**
     * Reference to the draft editor
     */
    const DraftRef = useRef<DraftEditor>(null)

    /**
     * Memoized implementation of the renderer function
     */
    const memoizedBockRendererFn = useCallback((block) => {
        const type = block.getType();
        if (type === "atomic") {
            return {
                component: CodeEditorWrapper,
                editable: false,
                props: {
                    language: 'javascript',
                    height: "20rem",
                    setEditorIsUp,
                    onFinishEdit: (newContentState: any) => {
                        setState(EditorState.createWithContent(newContentState))
                    }
                }
            }
        }
    }, [])

    /**
     * saveToStorageFn stores the editor contentState 
     * into the local storage
     */
    const saveToStorageFn = () => {
        const content = state.getCurrentContent()
        saveToLocalStorage(content)
    }

    /**
     * Retreives the data from local storage and sets
     * the state accordingly
     */
    const retreiveFromMemory = () => {
        const rawDataString = window.localStorage.getItem("article")
        if (rawDataString) {
            const rawData = JSON.parse(rawDataString)
            const contentState = convertFromRaw(rawData)
            setState(EditorState.createWithContent(contentState))
        }
    }

    /**
     * toggleInlineStyle toggles the inline style 
     * for the draftjs blocks
     * @param inlineStyle 
     */
    const toggleInlineStyle = (inlineStyle: string) => {
        setState(RichUtils.toggleInlineStyle(state, inlineStyle))
    }

    /**
     * Handler for toggling the block type
     * Has additional implementation to modify the
     * behaviour of the custom code editor
     * 
     * It ensures that the draft wrapper around the code
     * editor has set contentEditable to false.
     * 
     * NOTE: Not doing so will create problems like
     * draft taking control over the input on code editor!
     * @param blockType 
     */
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
            const newState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
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

                const divReferenceToMonacoParent = (monaocoParent as HTMLDivElement);

                divReferenceToMonacoParent.contentEditable = "false"
            }, 0)
        }
    }

    /**
     * onChangeHandler wraps setState
     * @param state 
     */
    const onChangeHandler = (state: EditorState) => setState(state)

    /**
     * focus function handles the focus on the draft editor
     */
    const focus = () => { if (!readonly) DraftRef.current?.focus() }

    /**
     * Handles the basic key commands on the editor
     * @param command 
     * @param editorState 
     */
    const handleKeyCommand = (command: string, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setState(newState);
            return true;
        }
        return false;
    }

    /**
     * Assigns speacial key mapping on the editor
     * @param e 
     */
    const mapKeyToEditorCommand = (e: any) => {

        setTimeout(() => {
            // Store to localstorage
            saveToStorageFn()
        }, 0)

        // Change tab functionality
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
                e,
                state,
                4, /* maxDepth */
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
            {!readonly && <Button name="Show data" onClick={() => console.log(state.toJS())} className={Classes.btn} />}
            {!readonly && <Button name="Save" onClick={saveToStorageFn} className={Classes.btn} />}
            {!readonly && <Button name="Load from Memory" onClick={retreiveFromMemory} className={Classes.btn} />}
        </div>
    );
}

export default BlogEditor
