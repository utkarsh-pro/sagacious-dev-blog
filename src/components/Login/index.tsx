import React from 'react'
import { ReactComponent as BlogIcon } from '../../assets/svg/blog.svg'

import Classes from './index.module.css'
import Button from '../Button'

function Login() {
    return (
        <div className={Classes.loginContainer}>
            <div className={Classes.form}>
                <div className={Classes.inputContainer}>
                    <div className={Classes.heading}>
                        Login
                    </div>
                    <input placeholder="Username" className={Classes.input} />
                    <input placeholder="Password" className={Classes.input} type="password" />
                    <Button name="Login" className={Classes.btn} onClick={() => console.log("Hello")} />
                </div>
                <div className={Classes.imgContainer}>
                    <BlogIcon fill="white" className={Classes.svg} />
                </div>
            </div>
        </div>
    )
}

export default Login
