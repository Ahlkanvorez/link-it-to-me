import React from 'react';

const Navbar = ({ username }) => (
    <div className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
            <div className="navbar-header">
                <button type="button" className="navbar-toggle"
                        data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand">
                    {username}
                </a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="nav navbar-nav">
                    <li>
                        <a href={`/auth/logout`}>
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

export default Navbar;