import React, { useEffect, useState, useCallback } from 'react'
import Editor from '../../Editor'

// =================================== INTERFACES =========================================
export interface ICodeEditorWrapper {
    blockProps: {
        language: string;
        height: string;
        setEditorIsUp: (state: boolean) => void;
        onFinishEdit: (contentState: any) => void;
    },
    block: any;
    contentState: any;
}

// =================================== COMPONENTS =========================================

/**
 * A wrapper for the code editor
 * @param props 
 */
const CodeEditorWrapper = (props: ICodeEditorWrapper) => {
    const { blockProps, block, contentState } = props;
    const [initCode, setInitCode] = useState("")

    useEffect(() => {
        // This sets the initial code while also making sure
        // that no "code" prop of the Editor is not
        // directly associated with a wrapper prop
        // Hence it avoids rerenders on each click
        setInitCode(contentState.getEntity(block.getEntityAt(0))?.getData()['content'])

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * Memoized implementation of onBlur handler
     */
    const memoizedOnBlur = useCallback(() => {
        blockProps.setEditorIsUp(false)
    }, [blockProps])

    /**
     * Memoized implementation of onFocus handler
     */
    const memoizedOnFocus = useCallback(() => {
        blockProps.setEditorIsUp(true)
    }, [blockProps])

    /**
     * Memoized implementation of onChange handler
     */
    const memoizedOnChange = useCallback((code: string) => {
        const entityKey = block.getEntityAt(0);
        if (entityKey) {
            const newContentState = contentState.mergeEntityData(
                entityKey,
                { content: code, language: blockProps.language }
            )
            blockProps.onFinishEdit(newContentState)
        }
    }, [blockProps, block, contentState])

    return (
        <Editor
            header
            footer
            onChange={memoizedOnChange}
            code={initCode}
            onBlur={memoizedOnBlur}
            onFocus={memoizedOnFocus}
            language={blockProps.language}
            height={blockProps.height} />)
}

export default CodeEditorWrapper