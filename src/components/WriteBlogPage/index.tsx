import React, { useState } from 'react'
import Preview, { Content } from '../Preview'
import Editor from '../Editor'

import Classes from './index.module.css'

function WriteBlogPage() {
    const [content, setContent] = useState(Array<Content>())

    const handleEditorInput = (content: string) => {
        const regexstart = new RegExp("```(.*?)", 'gs')

        const arrStart = content.matchAll(regexstart)
        const signPresence = [...arrStart];
        const codeIndex = [];
        const signPresencelength = signPresence.length;

        for (let i = 0; i < signPresencelength; i += 2) {
            if (i + 1 === signPresencelength) {
                codeIndex.push([signPresence[i].index, content.length])
                break;
            }
            codeIndex.push([signPresence[i].index, (signPresence[i + 1].index as number) + 3])
        }

        const flatCodeIndex = codeIndex.flat();
        const code = Array<Content>()

        for (let i = 0, j = 0; i < content.length;) {
            let uptill = 0;
            if (flatCodeIndex[j] === i && j % 2 === 0) {
                uptill = (flatCodeIndex[j + 1] as number) - i;
                const parsed = content.split('').splice(i, uptill).join('')
                let language = parsed.substring(parsed.indexOf("```") + 3, parsed.indexOf("\n"))
                const otherConfigArray = language.match(/\{.*?\}/gs) || []
                const otherConfig: { [key: string]: any } = {}
                // If the length is greater than 0 it suggests that a match was found
                if (otherConfigArray.length) {
                    otherConfigArray[0].split(" ").join("").slice(1, -1).split(",").forEach(el => {
                        if (el.includes(":")) {
                            const a1 = el.split(":");
                            otherConfig[a1[0]] = a1[1];
                        }
                    })
                    // Removing the config part from the language
                    language = language.substring(0, language.indexOf("{"))
                }
                const lastIndex = parsed.lastIndexOf("```")
                const terminate = lastIndex ? lastIndex : parsed.length
                const text = parsed.substring(parsed.indexOf("\n") + 1, terminate)
                code.push({
                    type: 'code',
                    content: {
                        language,
                        text,
                        config: otherConfig
                    }
                });
                i += uptill + 1;
                j += 2;
            } else {
                uptill = j < flatCodeIndex.length - 1 ? flatCodeIndex[j] as number - i : content.length - i;
                code.push({
                    type: 'markdown',
                    content: {
                        language: 'english',
                        text: content.split('').splice(i, uptill).join('')
                    }
                });
                i += uptill;
            }
        }

        setContent(code)
    }

    return (
        <div className={Classes.page}>
            <div className={Classes.codeContainer}>
                <h2 className={Classes.heading}>Write your markdown here</h2>
                <Editor
                    className={Classes.editor}
                    language="markdown"
                    onChange={handleEditorInput}
                    header />
            </div>
            <div className={Classes.previewContainer}>
                <h2 className={Classes.heading}>Live Preview</h2>
                <div className={Classes.preview}>
                    <Preview content={content} />
                </div>
            </div>
        </div>
    )
}

export default WriteBlogPage
