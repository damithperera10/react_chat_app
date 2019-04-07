import React from 'react';
import './Navbar_styles.css';

class Navbar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
                <a className="navbar-brand" href="#">TEAM CHAT</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                </div>
              
                {
                    this.props.userLoggedIn ?
                    <ul className="profile-wrapper">
                        <li>
                            <div className="profile">
                                <img src="http://gravatar.com/avatar/0e1e4e5e5c11835d34c0888921e78fd4?s=80" />
                                <a href="http://swimbi.com" className="name">{window.localStorage.getItem('username')}</a>
                                
                                <ul className="menu">
                                    <li><a href="#">Edit</a></li>
                                    <li><a href="#">Change Password</a></li>
                                    <li><a href="#">Log out</a></li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    :
                    null
                }
            </nav>
        )
    }
}

export default Navbar;