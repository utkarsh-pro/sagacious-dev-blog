import React from 'react'
import PreviewMarkdown from './PreviewMarkdown'
import PreviewCode from './PreviewCode'
import Classes from './index.module.css'

// ========================== INTERFACES =================================

export interface Content {
    type: 'markdown' | 'code';
    content: {
        language: string;
        text: string;
        config?: any;
    }
}

export interface PreviewProps {
    content: Array<Content>
}

// ========================== COMPONENT ===================================

function Preview({ content }: PreviewProps) {
    return (
        <div className={Classes.previewContainer}>
            {content.map((data, index) => {
                if (data.type === "markdown") return <PreviewMarkdown content={data.content.text} key={index} />
                else return (
                    <PreviewCode
                        code={data.content.text}
                        language={data.content.language.trim()}
                        key={index}
                        config={data.content.config} />
                )
            })}
        </div>
    )
}

export default Preview
