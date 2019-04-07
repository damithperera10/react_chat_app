import React from 'react';
import Users from "./Users";
import Messages from "./Messages";
import EnterChat from "./EnterChat";
import socketIOClient from 'socket.io-client';
import Sidebar from '../Sidebar';
import _ from 'underscore';

class Chat extends React.Component {

    constructor(props){
        super(props);
        this.socket = null;
        this.state = {
            username : localStorage.getItem('username') ? localStorage.getItem('username') : '',
            uid : localStorage.getItem('uid') ? localStorage.getItem('uid') : this.generateUID(),
            chat_ready : false,
            users : [],
            messages : [],
            message : '',
            openedChats: [],
            activeTab: ''
        }
    }

    componentDidMount(){
        if(this.state.username.length) {
            this.initChat();
        }
    }

    generateUID(){
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 15; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        localStorage.setItem('uid', text);
        return text;
    }

    setUsername(username, e){
        this.setState({
            username : username
        }, () => {
            this.initChat();
            window.localStorage.setItem('username', username);
            this.props.updateLoggedInStatus(true);
        });
    }

    sendMessage(message, e){
        console.log(message);
        this.setState({
            messages : this.state.messages.concat([{
               username : localStorage.getItem('username'),
               uid : localStorage.getItem('uid'),
               message : message,
           }])
        });
        this.socket.emit('message', {
            username : localStorage.getItem('username'),
            uid : localStorage.getItem('uid'),
            message : message,
        });
        this.scrollToBottom();
    }

    scrollToBottom(){
        let messages = document.getElementsByClassName('messages')[0];
        messages.scrollTop = messages.scrollHeight - messages.clientHeight;
    }

    initChat(){
        localStorage.setItem('username', this.state.username);
        this.setState({
            chat_ready : true,
        });
        this.socket = socketIOClient('ws://localhost:8989', {
            query : 'username='+this.state.username+'&uid='+this.state.uid
        });

        this.socket.on('updateUsersList', function (users) {
            this.setState({
                users : users
            });
        }.bind(this));

        this.socket.on('message', function (message) {
            this.setState({
                messages : this.state.messages.concat([message])
            });
            this.scrollToBottom();
        }.bind(this));
    }

    addToOpenedList(user, i) {
        const openedChats = this.state.openedChats.slice(0);
        const promise = new Promise((resolve, reject) =>{
            if (this.state.openedChats.length) {
                this.state.openedChats.map((data, ind) => {
                    if (!_.isEqual(data, {userName: user, id: i}) && ind === this.state.openedChats.length - 1) {
                        resolve(true);
                    } else if (_.isEqual(data, {userName: user, id: i})) {
                        reject('This Tab is already opened');
                    }
                })
            } else {
                resolve(true);
            }
        });
        promise.then((response) =>{
            if (response) {
                openedChats.push({userName: user, id: i});
                this.setState({ openedChats, activeTab: i });
            }
        }).catch((err) => {
            this.setState({ activeTab: i });
        })
    }

    closeOpenedTab(userObj) {
        let openedChats = this.state.openedChats.slice(0);
        openedChats = openedChats.filter(obj => !_.isEqual(userObj, obj));
        this.setState({ openedChats }, () => this.setSelectedTab(userObj.id-1));
    }

    setSelectedTab(tabId) {
        const openedChats = this.state.openedChats;
        let activeTab = 0;
        openedChats.map((data, i) => {
            if (tabId === data.id && i !== 0) {
                activeTab = openedChats[i-1] ? openedChats[i-1].id : 0;
            } else if (tabId === data.id && i === 0) {
                activeTab = openedChats[i+1] ? openedChats[i+1].id : 0;
            }
        });
        this.setState({ activeTab });
    }

    render() {
        return (
            <div className="chat">
                {this.state.chat_ready ? (
                    <React.Fragment>
                        <Sidebar users={this.state.users} addToOpenedList={this.addToOpenedList.bind(this)} selectedTab={this.state.activeTab}/>
                        <ul class="nav nav-tabs">
                        {
                            this.state.openedChats.length ? this.state.openedChats.map((userObj, i) => {
                                return (<React.Fragment>
                                        <li class="nav-item" key={i} onClick={this.setSelectedTab.bind(this, i)}>
                                            <a class={this.state.activeTab === userObj.id ? "nav-link active" : "nav-link"} href="#">{userObj.userName}
                                                <button type="button" class="close" aria-label="Close" onClick={this.closeOpenedTab.bind(this, userObj)}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </a>
                                        </li>
                                </React.Fragment>)     
                            }) : null
                        }
                        </ul>
                        <Messages
                            sendMessage={this.sendMessage.bind(this)}
                            messages={this.state.messages}
                        />
                    </React.Fragment>
                ) : (
                    <EnterChat
                        setUsername={this.setUsername.bind(this)}
                    />
                )}
            </div>
        )
    }
}

export default Chat;