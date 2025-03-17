
import {Route, Routes} from "react-router";
import {MainPage} from "./MainPage.js";
import {Account} from "./Account.tsx";
import {RegisterPage} from "./auth/RegisterPage.tsx";
import {LoginPage} from "./auth/LoginPage.tsx";
import {SetStateAction, useState} from "react";
import {useReviewFetching} from "./useReviewFetching.ts";


interface review {
    _id: string;
    album: string;
    artist: string;
    rating: string;
    review: string;
    author: string;
}

interface AppProps {
    reviews: review[];
}

function App(props: AppProps): JSX.Element {

    const [username, setUsername] = useState("");
    const [authToken, setAuthToken] = useState("");
    const [darkModeOn, setDarkMode] = useState(false);

    function darkToggle(){
        if(darkModeOn){
            document.body.classList.remove('dark-mode');
        }else {
            document.body.classList.add('dark-mode');
        }
        setDarkMode(!darkModeOn);
        console.log("dark-theme toggled");
    }

    const { isLoading, fetchedReviews } = useReviewFetching("", authToken);

    console.log("In App.tsx", fetchedReviews);

    return (
        <Routes>
            <Route path="/" element={<MainPage authToken={authToken} darkToggle={darkToggle} reviews={fetchedReviews} isLoading={isLoading} />} />
            <Route path="/account" element={<Account username={username} darkToggle={darkToggle} />} />
            <Route path="/register" element={<RegisterPage setAuthToken={setAuthToken} setUsername={setUsername} />} />
            <Route path="/login" element={<LoginPage setAuthToken={setAuthToken} setUsername={setUsername} />} />
        </Routes>
    );
}

export default App
