import React from "react";
import "./tokens.css";
import "./index.css";
import {Link} from "react-router";

interface AccountProps {
    darkToggle: () => void;
    username: string;
}

export function Account(props: AccountProps): JSX.Element {
    return (
        <div>
            <AccountHeader darkToggle={props.darkToggle} username={props.username}></AccountHeader>
            <Spacer></Spacer>
            <AccountDetails username={props.username}/>
        </div>
    )
}

function AccountHeader(props: AccountProps) {
    return (
        <div className="bg-black min-h-20 fixed top-0 left-0 w-full flex flex-row">
            <Link to="/"
                  className="maintext text-4xl w-full text-left ml-6 self-center bg-blue-500 rounded-2xl p-1 fill">Main</Link>
            <h1 className="maintext text-4xl w-full text-center self-center">Album Tracker</h1>
            <button onClick={props.darkToggle} className="w-full maintext">Dark Mode</button>

        </div>);
}

function Spacer() {
    return (
        <div className="bg-black/0 min-h-20 top-0 left-0">

        </div>
    )
}

interface AccountDetailsProps {
    username?: string
}

function AccountDetails({username}: AccountDetailsProps) {
        return (
        <div className="w-full flex flex-col items-center">
            <img src="src/album_placeholder.png" alt="" width="150em" className="rounded-2xl mr-3"/>
            <input
                className="border rounded-md p-2 reviewbackground antitext"
                value={username}
                //onChange={(e) => setUsername(e.target.value)}
            />
            <Link to="/login" className="antitext">Log out</Link>
        </div>
    );
}