import React from 'react'
import Manoco from '@monaco-editor/react'

import Classes from './index.module.css'

// =============================== INTERFACES =======================================

export type SupportedLanguage = 'javascript' | 'typescript' | 'cpp' | 'python'

export interface EditorProps {
    language?: SupportedLanguage;
    className?: string;
}

// =============================== COMPONENTS =======================================

function Editor({ language, className }: EditorProps) {
    return (
        <div className={className}>
            <div className={Classes.editor}>
                <div className={Classes.head}>
                    <div className={Classes.cbtns} style={{ backgroundColor: "#F53434" }} />
                    <div className={Classes.cbtns} style={{ backgroundColor: "#F5F932" }} />
                    <div className={Classes.cbtns} style={{ backgroundColor: "#00D809" }} />
                </div>
                <Manoco language={language || "javascript"} theme="dark" height="calc(100% - 3rem)" />
            </div>
        </div>
    )
}

export default Editor
