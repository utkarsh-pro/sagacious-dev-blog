import React, { useRef } from 'react'
// import marked from 'marked'
import TextBox from './TextBox'
import Classes from './index.module.css'

// const textBoxclickHandler = () => {
//     return <TextBox />
// }

function WriteBlogPage() {
    const ref = useRef<HTMLDivElement>(null)

    return (
        <div className={Classes.page} ref={ref}>
            <div className={Classes.code}>
                <TextBox height={100} />
            </div>
            <div className={Classes.preview}>

            </div>
        </div>
    )
}

export default WriteBlogPage
