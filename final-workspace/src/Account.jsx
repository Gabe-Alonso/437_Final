import React from "react";
import "./tokens.css";
import "./index.css";

export function Account(props){
    return(
        <div>
            <AccountHeader darkToggle={props.darkToggle}></AccountHeader>
            <Spacer></Spacer>
            <AccountDetails />
        </div>
    )
}

function AccountHeader(props){
    return (<div className="bg-black min-h-20 fixed top-0 left-0 w-full flex flex-row">
        <a href="/" className="maintext text-4xl w-full text-left ml-6 self-center bg-blue-500 rounded-2xl p-1 fill">Main</a>
        <h1 className="maintext text-4xl w-full text-center self-center">Album Tracker</h1>
        <button onClick={props.darkToggle} className="w-full maintext">Dark Mode</button>

    </div>);
}

function Spacer(props) {
    return (
        <div className="bg-black/0 min-h-20 top-0 left-0">

        </div>
    )
}

function AccountDetails(props) {
    const [username, setUsername] = React.useState('username');


    return (
        <div className="w-full flex flex-col items-center">
            <img src="src/album_placeholder.png" alt="" width="150em" className="rounded-2xl mr-3"/>
            <input
                className="border rounded-md p-2 reviewbackground antitext"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
        </div>
    );
}