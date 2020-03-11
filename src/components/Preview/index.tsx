import React, { useEffect, useRef } from 'react'
import marked from 'marked'
import Classes from './index.module.css'

// ========================== INTERFACES =================================


function Preview({ content }: { content: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {

    }, [content])


    return (
        <div className={Classes.previewContainer}>
            <div className={Classes.markdown} ref={ref} />

        </div>
    )
}

export default Preview
