import React, { useRef } from 'react'
import Classes from './index.module.css'

function TextBox({ height = 100, onChange }: { height?: number, onChange: Function }) {
    const ref = useRef<HTMLTextAreaElement>(null)

    const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const currentHeight = +event.target.style.height.slice(0, -2)
        event.target.style.height = currentHeight < height ? "inherit" : `${height}px`
        event.target.style.height = `${event.target.scrollHeight}px`;

        onChange(ref.current?.value)
    }

    return (
        <div className={Classes.textbox}>
            <textarea
                className={Classes.textarea}
                style={{ height }}
                ref={ref}
                onChange={changeHandler} />
        </div>
    )
}

export default TextBox
