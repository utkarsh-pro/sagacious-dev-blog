import React, { useState, useRef, useEffect } from 'react'
import Manoco from '@monaco-editor/react'

import Classes from './index.module.css'

// =============================== CONSTANTS ========================================
export const SUPPORTED_LANGUAGES = [
    "javascript",
    "typescript",
    "cpp",
    "c",
    "python",
    "go",
    "css",
    "html",
    "dockerfile",
    "java",
    "kotlin",
    "markdown",
    "lua",
    "objective-c",
    "pgsql",
    "php",
    "r",
    "shell",
    "ruby",
    "rust",
    "scss",
    "sql",
    "swift",
    "xml",
    "yaml",
    ""
]

// =============================== INTERFACES =======================================

export interface EditorProps {
    language?: string;
    code?: string;
    readOnly?: boolean;
    className?: string;
    onChange?: (content: any) => void;
    header?: boolean;
    footer?: boolean;
    height?: string;
}

interface EditorBtnProps {
    onClick: (e: React.MouseEvent) => void;
    name: string;
    options?: boolean;
}

interface SupportedLanguagesProps {
    onClick: (language: string) => void;
    setDisplay: () => void;
}

// =============================== COMPONENTS =======================================

function EditorBtn({ onClick, name, options = false }: EditorBtnProps) {
    const [clicked, setClicked] = useState(false)
    const onClickHander = (e: React.MouseEvent) => {
        setClicked(!clicked)
        onClick(e)
    }

    return (
        <div className={Classes.editorBtn} onClick={onClickHander}>
            {options && <div className={[Classes.icon, clicked ? Classes.active : null].join(' ').trimEnd()}>&#9650;</div>}
            <div className={Classes.editorBtnName}>{name}</div>
        </div>
    )
}

// ******************************************************************************************************************

function SupportedLanguages({ onClick, setDisplay }: SupportedLanguagesProps) {
    const [value, setValue] = useState<string>('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            return document.removeEventListener("mousedown", handleClick);
        }

        // eslint-disable-next-line
    }, [])

    const handleClick = (e: MouseEvent) => {
        if ((ref.current as Node).contains(e.target as Node)) return;
        else setDisplay()
    }

    const onChange = (e: React.ChangeEvent) => {
        setValue((e.target as HTMLInputElement).value)
    }

    const onClickHander = (e: React.MouseEvent) => {
        onClick((e.target as HTMLDivElement).innerText)
    }

    return (
        <div className={Classes.SL} ref={ref}>
            <div className={Classes.slinputContainer}>
                <input
                    className={Classes.slinput}
                    autoFocus
                    placeholder="Set Language"
                    value={value}
                    onChange={onChange} />
            </div>
            <div className={Classes.sllist}>
                {SUPPORTED_LANGUAGES
                    .filter(sl => sl.toLocaleLowerCase().startsWith(value.toLocaleLowerCase()))
                    .sort()
                    .map((sl, i) => <div key={i} onClick={onClickHander}>{sl}</div>)
                }
            </div>
        </div>
    )
}

// ******************************************************************************************************************
function Header() {
    return (
        <div className={Classes.head}>
            <div className={Classes.cbtns} style={{ backgroundColor: "#F53434" }} />
            <div className={Classes.cbtns} style={{ backgroundColor: "#F5F932" }} />
            <div className={Classes.cbtns} style={{ backgroundColor: "#00D809" }} />
        </div>
    )
}

// ******************************************************************************************************************

function Editor({
    language = "javascript",
    className,
    code = "",
    readOnly = false,
    onChange,
    footer = true,
    header = true,
    height
}: EditorProps) {

    const [currentLanguage, setCurrentLanguage] = useState<string>(language);
    const [editable, setEditable] = useState<boolean>(!readOnly)
    const [displayOptions, setDisplayOptions] = useState<boolean>(false)

    const ref = useRef<any>(null)

    const setEditableHandler = () => setEditable(!editable)
    const setDisplayHandler = () => setDisplayOptions(!displayOptions)
    const handleMount = (_valueGetter: any, editor: any) => {
        ref.current = editor;

        if (typeof onChange === "function") {
            ref.current.onDidChangeModelContent((ev: any) => {
                onChange(ref.current.getValue());
            })
        }
    }

    return (
        <div className={className} style={{ height }}>
            <div className={Classes.editor}>
                {
                    displayOptions
                    &&
                    <div className={Classes.option}>
                        <SupportedLanguages onClick={setCurrentLanguage} setDisplay={setDisplayHandler} />
                    </div>
                }
                {header && <Header />}
                <Manoco
                    options={{ readOnly: !editable }}
                    value={code}
                    language={currentLanguage}
                    theme="dark"
                    editorDidMount={handleMount}
                    height="calc(100% - 3rem)" />
                {
                    footer
                    &&
                    <div className={Classes.bottom}>
                        <EditorBtn onClick={setDisplayHandler} name={currentLanguage.toLocaleUpperCase()} options />
                        <EditorBtn onClick={setEditableHandler} name={`Edit: ${editable}`} />
                    </div>
                }
            </div>
        </div>
    )
}

export default Editor
