import React from 'react';

const NavbarToggleButton = () => (
    <button type="button" className="navbar-toggle"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1">
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
    </button>
);

const NavbarHeader = ({ username }) => (
    <div className="navbar-header">
        <NavbarToggleButton />
        <a className="navbar-brand">
            { username }
        </a>
    </div>
);

const NavbarLinks = ({ links }) => (
    <div className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1">
        <ul className="nav navbar-nav">
            {
                links.map(({ text, url }) => (
                    <li key={ url }>
                        <a href={url}>
                            { text }
                        </a>
                    </li>
                ))
            }
        </ul>
    </div>
);

const Navbar = ({ username = 'Anonymous', links = [] }) => (
    <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
            <NavbarHeader username={ username } />
            <NavbarLinks links={ links } />
        </div>
    </div>
);

export default Navbar;