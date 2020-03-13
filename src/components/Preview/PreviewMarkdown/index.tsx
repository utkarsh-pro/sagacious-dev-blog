import React, { useEffect, useRef } from 'react'
import marked from 'marked'
import Classes from './index.module.css'

function PreviewMarkdown({ content }: { content: string }) {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) ref.current.innerHTML = marked(content)
    }, [content])

    return (
        <div ref={ref} className={Classes.md} />
    )
}

export default PreviewMarkdown
