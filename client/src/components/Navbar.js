import React from 'react';
import PropTypes from 'prop-types';

const linksPropType = PropTypes.arrayOf(
    PropTypes.shape([
        PropTypes.string
    ]).isRequired
).isRequired;

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

const NavbarHeader = ({ username = 'Anonymous' }) => (
    <div className="navbar-header">
        <NavbarToggleButton />
        <a className="navbar-brand">
            { username }
        </a>
    </div>
);

NavbarHeader.propTypes = {
    username: PropTypes.string.isRequired
};

const NavbarLinks = ({ links = [] }) => (
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

NavbarLinks.propTypes = {
    links: linksPropType.isRequired
};

const Navbar = ({ username, links }) => (
    <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
            <NavbarHeader username={ username } />
            <NavbarLinks links={ links } />
        </div>
    </div>
);

Navbar.propTypes = {
    username: PropTypes.string,
    links: linksPropType.isRequired
};

export default Navbar;
