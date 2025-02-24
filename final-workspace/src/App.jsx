
import {Route, Routes} from "react-router";
import {MainPage} from "./MainPage.jsx";
import {Account} from "./Account.jsx";

function App(props) {

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
