import React, { useState, useRef, useEffect } from 'react'
import Manoco from '@monaco-editor/react'

import Classes from './index.module.css'

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
    onBlur?: (event?: any) => void;
    onFocus?: (event?: any) => void;
}

interface EditorBtnProps {
    onClick: (e: React.MouseEvent) => void;
    name: string;
    setRef?: React.RefObject<HTMLDivElement>;
    options?: boolean;
}

interface SupportedLanguagesProps {
    onClick: (language: string) => void;
    setDisplay: () => void;
    interrupt: (e: MouseEvent, currentRef: React.RefObject<HTMLDivElement>) => boolean;
}

export interface ISupportedLanguageMap {
    [language: string]: {
        displayName: string;
    };
}


// =============================== CONSTANTS ========================================

export const SUPPORTED_LANGUAGES: ISupportedLanguageMap = {
    abap: { displayName: "ABAP (Advanced Business Application Programming)" },
    apex: { displayName: "Apex" },
    bat: { displayName: "Batch" },
    clojure: { displayName: "Clojure" },
    coffee: { displayName: "CoffeeScript" },
    cpp: { displayName: "C++" },
    csharp: { displayName: "C#" },
    csp: { displayName: "CSP (Communication Sequential Processing)" },
    css: { displayName: "CSS" },
    dart: { displayName: "Dart" },
    dockerfile: { displayName: "Dockerfile" },
    fsharp: { displayName: "F#" },
    go: { displayName: "Go (Golang)" },
    graphql: { displayName: "Graphql" },
    handlebars: { displayName: "Handlebars" },
    html: { displayName: "HTML" },
    java: { displayName: "Java" },
    javascript: { displayName: "JavaScript" },
    julia: { displayName: "Julia" },
    kotlin: { displayName: "Kotlin" },
    less: { displayName: "Less" },
    lexon: { displayName: "Lexon" },
    lua: { displayName: "Lua" },
    markdown: { displayName: "Markdown" },
    mips: { displayName: "MIPS" },
    mysql: { displayName: "MySQL" },
    "objective-c": { displayName: "Objective-C" },
    pascal: { displayName: "Pascal" },
    perl: { displayName: "Perl" },
    pgsql: { displayName: "PGSQL" },
    php: { displayName: "PHP" },
    "": { displayName: "Plain Text" },
    powershell: { displayName: "PowerShell" },
    pug: { displayName: "pug" },
    python: { displayName: "Python3" },
    r: { displayName: "R" },
    ruby: { displayName: "Ruby" },
    rust: { displayName: "Rust" },
    scss: { displayName: "SCSS" },
    shell: { displayName: "Shell" },
    sophia: { displayName: "Sopia" },
    sql: { displayName: "SQL" },
    swift: { displayName: "Swift" },
    twig: { displayName: "Twig" },
    typescript: { displayName: "TypeScript" },
    vb: { displayName: "Visual Basic" },
    xml: { displayName: "XML" },
    yaml: { displayName: "YAML" }
}

// ========================================== COMPONENTS ====================================================

function EditorBtn({ onClick, name, options = false, setRef }: EditorBtnProps) {
    const [clicked, setClicked] = useState(false)
    const onClickHander = (e: React.MouseEvent) => {
        setClicked(!clicked)
        onClick(e)
    }

    return (
        <div className={Classes.editorBtn} onClick={onClickHander} ref={setRef}>
            {options && <div className={[Classes.icon, clicked ? Classes.active : null].join(' ').trimEnd()}>&#9650;</div>}
            <div className={Classes.editorBtnName}>{name}</div>
        </div>
    )
}

// ******************************************************************************************************************

function SupportedLanguages({ onClick, setDisplay, interrupt }: SupportedLanguagesProps) {
    const [value, setValue] = useState<string>('');
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleMouseDown);

        return () => {
            return document.removeEventListener("mousedown", handleMouseDown);
        }

        // eslint-disable-next-line
    }, [])

    const handleMouseDown = (e: MouseEvent) => {
        if (interrupt(e, ref)) return
        else setDisplay()
    }


    const onChange = (e: React.ChangeEvent) => {
        setValue((e.target as HTMLInputElement).value)
    }

    const onClickHander = (e: React.MouseEvent) => {
        onClick((e.target as HTMLDivElement).getAttribute("data-lid") as string)
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
                {
                    Object
                        .keys(SUPPORTED_LANGUAGES)
                        .map((sl, i) => {
                            const name = SUPPORTED_LANGUAGES[sl].displayName;
                            if (value) {
                                if (name.toLocaleLowerCase().startsWith(value.toLocaleLowerCase()))
                                    return <div key={i} data-lid={sl} onClick={onClickHander}>{name}</div>
                            } else {
                                return <div key={i} data-lid={sl} onClick={onClickHander}>{name}</div>
                            }
                            return null
                        })
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

// =========================================== HELPER FUNCTION ===========================================

function getHeight(renderFooter: boolean, renderHeader: boolean) {
    let height = 0;
    const HEADER_HEIGHT = 1.95 // If height of header is changed in CSS then change it here also
    const FOOTER_HEIGHT = 1.5 // If height of footer is changed in CSS then change it here also

    switch (true) {
        case renderFooter:
            height += FOOTER_HEIGHT
            break;
        case renderHeader:
            height += HEADER_HEIGHT
            break;
        default:
            break;
    }

    return height
}

// =========================================== COMPONENT =================================================

function Editor({
    language = "javascript",
    className,
    code = "",
    readOnly = false,
    onChange,
    footer = false,
    header = false,
    height = "20rem",
    onBlur,
    onFocus
}: EditorProps) {

    const [currentLanguage, setCurrentLanguage] = useState<string>(language);
    const [editable, setEditable] = useState<boolean>(!readOnly)
    const [displayOptions, setDisplayOptions] = useState<boolean>(false)

    const ref = useRef<any>(null)
    const languageSelectorRef = useRef<HTMLDivElement>(null)

    const setEditableHandler = () => setEditable(!editable)
    const setDisplayHandler = () => setDisplayOptions(!displayOptions)
    const handleMount = (_valueGetter: any, editor: any) => {
        ref.current = editor;

        ref.current.onDidBlurEditorText((ev: any) => {
            if (onBlur) onBlur(ev)
        })

        ref.current.onDidFocusEditorText((ev: any) => {
            if (onFocus) onFocus(ev)
        })

        if (typeof onChange === "function") {
            ref.current.onDidChangeModelContent((ev: any) => {
                onChange(ref.current.getValue());
            })
        }
    }

    const interrupt = (e: MouseEvent, currentRef: React.RefObject<HTMLDivElement>) => {
        const currentNode = currentRef.current as Node;
        const targetNode = e.target as Node;
        console.log(languageSelectorRef.current)
        if ((languageSelectorRef.current as Node).contains(targetNode) || currentNode.contains(targetNode))
            return true;

        return false;
    }

    return (
        <div className={className} style={{ height }}>
            <div className={Classes.editor}>
                {
                    displayOptions
                    &&
                    <div className={Classes.option}>
                        <SupportedLanguages
                            interrupt={interrupt}
                            onClick={setCurrentLanguage}
                            setDisplay={setDisplayHandler} />
                    </div>
                }
                {header && <Header />}
                <Manoco
                    options={{ readOnly: !editable }}
                    value={code}
                    language={currentLanguage}
                    theme="dark"
                    editorDidMount={handleMount}
                    height={`calc(100% - ${getHeight(footer, header)}rem)`} />
                {
                    footer
                    &&
                    <div className={Classes.bottom}>
                        <EditorBtn
                            setRef={languageSelectorRef}
                            onClick={setDisplayHandler}
                            name={SUPPORTED_LANGUAGES[currentLanguage].displayName}
                            options />
                        <EditorBtn onClick={setEditableHandler} name={`Edit: ${editable}`} />
                    </div>
                }
            </div>
        </div>
    )
}

export default Editor
