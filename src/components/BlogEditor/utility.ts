export const getPosition = (editor: any, editorRef: React.RefObject<any>) => {
    const position = { left: -100, top: -100 }
    if (editor) {
        const selectionState = editor.getSelection()
        const start = selectionState.getStartKey();
        const currentContent = editor.getCurrentContent();
        const currentContentBlock = currentContent.getBlockForKey(start);

        const node = document.querySelectorAll(
            `[data-offset-key="${currentContentBlock.getKey()}-0-0"]`
        )[0];

        if (editorRef.current) {
            const editorRoot = editorRef.current.refs?.editor || editorRef.current.editor
            if (editorRoot && node) {
                console.log(
                    (node as HTMLDivElement).offsetTop + (editorRoot as HTMLDivElement).offsetTop,
                    (editorRoot as HTMLDivElement).offsetLeft - (16 * 5)
                )

                position.left = (editorRoot as HTMLDivElement).offsetLeft - (16 * 5)
                position.top = (node as HTMLDivElement).offsetTop
            }
        }
    }

    return position
}