
import {Route, Routes} from "react-router";
import {MainPage} from "./MainPage.js";
import {Account} from "./Account.tsx";


interface review {
    id: string; album: string; artist: string; rating: string; review: string; completed: boolean;
}

interface AppProps {
    reviews: review[];
}

function App(props: AppProps): JSX.Element {

    function darkToggle(){
        if(document.body.classList.contains('dark-mode')){
            document.body.classList.remove('dark-mode');
        }else {
            document.body.classList.add('dark-mode');
        }
        console.log("dark-theme toggled");
    }



    return (
        <Routes>
            <Route path="/" element={<MainPage darkToggle={darkToggle} reviews={props.reviews} />} />
            <Route path="/account" element={<Account darkToggle={darkToggle} />} />
        </Routes>
    );
}

export default App
