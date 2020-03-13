import React from 'react'
import Editor, { SUPPORTED_LANGUAGES } from '../../Editor'
import Classes from './index.module.css'

// ======================= INTERFACES ============================
export interface CodePreviewProps {
    language: string;
    code: string;
}

// ======================= COMPONENT =============================
function PreviewCode({ language, code }: CodePreviewProps) {
    if (!SUPPORTED_LANGUAGES.includes(language)) return <div />
    return (
        <Editor language={language} code={code} readOnly className={Classes.editor} />
    )
}

export default PreviewCode
