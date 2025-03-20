import {UsernamePasswordForm} from "./UsernamePasswordForm.js";
import {Link, useNavigate} from "react-router";
import {sendPostRequest} from "../sendPostRequest.js";
import {useState} from "react";


export function LoginPage(props: { setAuthToken: (arg0: any) => void; setUsername: (arg0: string) => void; }) {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    function onLogin(username: string, password: string) {
        console.log("Inside login");
        console.log(username, password);
        sendPostRequest("/auth/login", {name: username, password: password}).then(res => {
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
        <section className="body">
            <h1 className="antitext">Login</h1>
            <UsernamePasswordForm onSubmit={onLogin}></UsernamePasswordForm>
            <p style={{color: "red"}}>{error}</p>
            <Link className="antitext" to="/register">Dont have an account? Register Here</Link>
        </section>
    );
}