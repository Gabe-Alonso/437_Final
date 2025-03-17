import {UsernamePasswordForm} from "./UsernamePasswordForm.js";
import {sendPostRequest} from "../sendPostRequest.js";
import {useState} from "react";
import {Link, useNavigate} from "react-router";





export function RegisterPage(props: { setAuthToken: (arg0: string) => void; setUsername: (arg0: string) => void; }) {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    function onRegister(username: string, password: string) {
        console.log("Inside register");
        console.log(username, password);
        sendPostRequest("/auth/register", {name: username, password: password}).then(res => {
            console.log(res);
            if (res.status >= 300) {
                setError(res.data.message);
            } else {
                setError("");
                // eslint-disable-next-line react/prop-types
                props.setAuthToken(res.data.token);
                // eslint-disable-next-line react/prop-types
                props.setUsername(username);
                console.log("logged", res.data.token);
                navigate("/");
            }
        });
    }

    return (
        <div className="body">
            <h1 className="antitext">Register a New Account</h1>
            <UsernamePasswordForm onSubmit={onRegister}></UsernamePasswordForm>
            <p style={{color: "red"}}>{error}</p>
            <Link className="antitext" to="/login">Already have an account? Log in Here</Link>
        </div>
    );
}