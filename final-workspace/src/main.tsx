import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.js'
import React from 'react'
import './App.css'
import { BrowserRouter } from 'react-router'


const DATA = [
    { id: "todo-0", album: "Alligator Bites Never Heal", artist: "Doechii", rating: "9", review: "another banger", completed: true },
    { id: "todo-1", album: "To Pimp A Butterfly", artist: "Kendrick Lamar", rating: "10", review: "another banger", completed: false },
    { id: "todo-2", album: "Inedito", artist: "Antonio Carlos Jobim", rating: "9", review: "another banger", completed: false },
    { id: "todo-3", album: "IGOR", artist: "Tyler, the Creator", rating: "10", review: "another banger", completed: false },
];

const root = document.getElementById('root');

if (root != null) {
    createRoot(root).render(
         <BrowserRouter>
             <App reviews={DATA}/>
         </BrowserRouter>,
    )
}
