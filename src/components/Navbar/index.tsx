import React from 'react'
import Classes from './index.module.css'

function Navbar() {
    return (
        <div className={Classes.navbar}>
            <div className={Classes.logo}>Sagacious Dev</div>
            <div className={Classes.others}>
                <div className={Classes.navitem}>Search Posts</div>
                <div className={Classes.navitem}>Login</div>
                <div className={Classes.navitem}>Signup</div>
            </div>
            <div className={Classes.hamburger}>
                <div className={Classes.line} />
                <div className={Classes.line} />
                <div className={Classes.line} />
            </div>
        </div>
    )
}

export default Navbar
