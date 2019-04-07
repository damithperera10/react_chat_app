import React, { Component } from 'react';
import './Sidebar_Style.css';

class Sidebar extends Component {

    constructor(props){
        super(props);
        this.state = {
            users : props.users
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        return  {
            users : nextProps.users,
        }
    }

    addToOpenedChats(user, i) {
        this.props.addToOpenedList(user, i);
    }

    render() {
        return (
        <div class="wrapper active users col-xs-12 col-sm-12 col-md-4 col-lg-2">
            <nav id="sidebar">
                <div class="sidebar-header">
                    <h3>Invictus</h3>
                </div>

                <ul class="list-unstyled components">
                    <li>
                        <a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">Team Chat</a>
                        <ul class="collapse list-unstyled" id="homeSubmenu">
                            {this.state.users.length ? this.state.users.map((user, i) => {
                                return (
                                    <li className={this.props.selectedTab !== '' && this.props.selectedTab === i ? "list_style tab_selected" : "list_style"} key={i} onClick={this.addToOpenedChats.bind(this, user, i)}>
                                        <i className="fa fa-user"/> {user}
                                    </li>
                                )
                            }) : 'No Users Online'}
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
        )
    }
}

export default Sidebar;