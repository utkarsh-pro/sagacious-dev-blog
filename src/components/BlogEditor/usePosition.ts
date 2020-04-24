import { useEffect, useState } from 'react';

const intialPosition = { top: 0, left: 0 }

export default (editor: any, editorRef: any, offSet: boolean) => {
    const [position, setPostion] = useState(intialPosition)

    useEffect(() => {
        const calculatedPosition = intialPosition;

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

        if (!offSet) {
            console.log((editorRoot as HTMLDivElement).offsetLeft)
            calculatedPosition.left = (editorRoot as HTMLDivElement).offsetLeft - (16 * 5)
        } else {
            console.log("Boom")
            const startOffSet = selectionState.getStartOffset()
            const endOffSet = selectionState.getEndOffset()
            const averageOffSet = (startOffSet + endOffSet) / 2;
            calculatedPosition.left = (editorRoot as HTMLDivElement).offsetLeft + averageOffSet
        }

        calculatedPosition.top = (node as HTMLDivElement).offsetTop
        setPostion(calculatedPosition)

    }, [editor, editorRef, offSet])

    return position
}