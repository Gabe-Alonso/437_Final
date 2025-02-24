import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {MainPage} from './MainPage.jsx'
import App from './App.jsx'
import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { nanoid } from "nanoid";
import {GroceryPanel} from "./GroceryPanel.jsx";
import { useRef } from 'react';
import {Spinner} from "./assets/Spinner.jsx";
import {Route, Routes} from "react-router";
import { BrowserRouter } from 'react-router'


const DATA = [
    { id: "todo-0", album: "Alligator Bites Never Heal", artist: "Doechii", rating: "9", review: "another banger", completed: true },
    { id: "todo-1", album: "To Pimp A Butterfly", artist: "Kendrick Lamar", rating: "10", review: "another banger", completed: false },
    { id: "todo-2", album: "Inedito", artist: "Antonio Carlos Jobim", rating: "9", review: "another banger", completed: false },
    { id: "todo-3", album: "IGOR", artist: "Tyler, the Creator", rating: "10", review: "another banger", completed: false },
];

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App reviews={DATA}/>
  </BrowserRouter>,
)
