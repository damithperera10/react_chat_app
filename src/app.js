import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import 'font-awesome/css/font-awesome.css';
import './app.scss';
import Navbar from './components/Navbar';
import Chat from './components/chat/Chat';

class App extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            userLoggedIn: false
        }
    }

    updateLoggedInStatus(status) {
        this.setState({ userLoggedIn: status })
    }

    render(){
        return(
            <React.Fragment>
                <Chat loginStatus = {this.state.userLoggedIn} updateLoggedInStatus={this.updateLoggedInStatus.bind(this)}/>
                <Navbar userLoggedIn = {this.state.userLoggedIn}/>
            </React.Fragment>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);