import React from 'react'
import Editor, { SUPPORTED_LANGUAGES } from '../../Editor'
import Classes from './index.module.css'

// ======================= INTERFACES ============================
export interface CodePreviewProps {
    language: string;
    code: string;
    config: {
        [key: string]: any;
    }
}

// ======================= COMPONENT =============================
function PreviewCode({ language, code, config }: CodePreviewProps) {
    if (!SUPPORTED_LANGUAGES[language]) return <div />
    return (
        <Editor
            language={language}
            code={code}
            readOnly
            className={Classes.editor}
            height={config.height}
            footer={config.footer && config.footer === "true"}
            header={config.header && config.header === "true"} />
    )
}

export default PreviewCode
