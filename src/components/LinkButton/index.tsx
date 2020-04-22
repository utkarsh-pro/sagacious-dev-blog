import React from 'react'
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll'

// ================================== INTERFACES =================================
export enum LinkType {
    INTERNAL_HASH,
    INTERNAL,
    EXTERNAL
}

export interface ILinkType {
    type: LinkType,
    link: string
}

export interface ILinkButton {
    name: string;
    link: ILinkType;
    className?: string;
    activeClassName?: string;
}

// ================================== COMPONENT =================================

function LinkButton({ name, link, className, activeClassName }: ILinkButton) {
    if (link.type === LinkType.INTERNAL)
        return (
            <Link to={link.link}>
                <div className={className}>
                    {name}
                </div>
            </Link>
        )
    else if (link.type === LinkType.INTERNAL_HASH)
        return (
            <ScrollLink
                style={{ cursor: "pointer" }}
                activeClass={activeClassName}
                spy={true}
                smooth={true}
                offset={0}
                duration={500}
                to={link.link}>
                <div className={className}>
                    {name}
                </div>
            </ScrollLink>
        )
    else return (
        <a href={link.link} target="_blank" rel="noopener noreferrer">
            <div className={className}>
                {name}
            </div>
        </a>
    )
}

export default LinkButton