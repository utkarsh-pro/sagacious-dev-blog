import React from 'react'
import Classes from './index.module.css'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className={Classes.navbar}>
            <Link to="/">
                <div className={Classes.logo}>Sagacious Dev</div>
            </Link>
            <div className={Classes.others}>
                <div className={Classes.navitem}>Explore</div>
                <div className={Classes.navitem}>Login</div>
                <div className={Classes.navitem}>Signup</div>
            </div>
            <div className={Classes.hamburger}>
                <div className={Classes.line} />
                <div className={Classes.line} />
                <div className={Classes.line} />
            </div>
        </nav>
    )
}

export default Navbar
