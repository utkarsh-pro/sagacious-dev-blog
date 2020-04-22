import React, { useRef } from 'react'
import { Editor, EditorState } from 'draft-js';
import Classes from './index.module.css'

function BlogEditor() {
    const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
    const ref = useRef<Editor>(null)

    const onClick = () => ref.current?.focus()

    return (
        <div className={Classes.container}>
            <div className={Classes.editor} onClick={onClick}>
                <Editor
                    placeholder="Enter some text..."
                    editorState={editorState}
                    onChange={setEditorState} />
            </div>
        </div>
    );
}

export default BlogEditor
