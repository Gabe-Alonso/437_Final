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
import {Spacer} from "./Spacer.jsx";
import "./tokens.css";
import "./index.css";


export function MainPage(props) {
    const [reviews, setReviews] = React.useState(props.reviews);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    //console.log("Immediate variable is " + isOpen);


    const reviewList = (reviews?.map((review) => (
        <AlbumReview
            id={review.id}
            album={review.album}
            artist={review.artist}
            rating={review.rating}
            review={review.review}
            completed={review.completed}
            key={review.id}
            onCheckbox={() => toggleTaskCompleted(review.id)}
            onDelete={() => deleteReview(review.id)}
        />
    )));
    function addReview(album="Album", artist = "Artist", rating = "0", review = "Review") {
        fetchData("").then(async (res) => {
            const newReview = { id: `todo-${nanoid()}`, album: album, artist: artist, rating: rating, review: review, completed: false };
            console.log("Adding new review");
            //console.log(reviews);
            setReviews([...reviews, newReview]);
            });

    }

    function delayMs(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetchData(url) {
        setIsLoading(true);
        console.log("Loading...");

        delayMs(2000).then(async () => {
            try {
            } catch (error) {

            } finally {
                setIsLoading(false);
                console.log("Done Loading");
                setIsOpen(false);
            }
        });
    }

    function onCloseRequested() {
        const newModalStatus = !isOpen;
        setIsOpen(newModalStatus);
    }

    function toggleTaskCompleted(id) {

        const updatedReviews = reviews.map((review) => {
            // if this review has the same ID as the edited review
            if (id === review.id) {
                // use object spread to make a new object
                // whose `completed` prop has been inverted
                //console.log("Updated review " + review.name);
                return { ...review, completed: !review.completed };
            }
            return review;
        });
        setReviews(updatedReviews);
    }
    function deleteReview(id) {
        const updatedTasks = reviews.map((review) => {
            // if this review has the same ID as the edited review
            if (id === review.id) {
                // use object spread to make a new object
                // whose `completed` prop has been inverted
                //console.log("kill review " + review.name);
                //return { ...review, completed: !review.completed };
            }
            return review;
        });
        setReviews(updatedTasks.filter((review) => review.id !== id));
    }
    const addFormHeader = "New Review";
    //console.log("Before returning the app, the modal is " + isOpen);
    return (
        <main className="m-4"> {/* Tailwind: margin level 4 on all sides */}
            <Header darkToggle={props.darkToggle}></Header>

            <Spacer></Spacer>
            <Modal
                headerLabel={addFormHeader}
                openModal={isOpen}
                closeModal={onCloseRequested}
            >
                <AddReviewForm onNewReview={addReview} isLoading={isLoading} />
            </Modal>


            <section className="justify-self-center">
                <ul
                    role="list"
                    className="todo-list stack-large stack-exception"
                    aria-labelledby="list-heading">
                    {reviewList}
                </ul>
            </section>
            <Spacer></Spacer>
            <Footer onCloseRequested = {onCloseRequested}> </Footer>
        </main>
    );

}

function AlbumReview(props) {
    return (
        <li className="">
            {/*<input id={props.id} type="checkbox" onChange={props.onCheckbox} defaultChecked={props.completed}/>*/}
            <label className="todo-label m-0.5" htmlFor={props.id}>
            </label>
            <div className="flex flex-row p-1 reviewbackground rounded-2xl p-2">
                <img src="src/album_placeholder.png" alt="" width="75em" className="rounded-2xl mr-3" />
                <div className="flex flex-col">
                    <p className="antitext">
                        {props.artist}
                    </p>
                    <p className="antitext">
                        {props.album}
                    </p>
                    <p className="antitext overflow-ellipsis">
                        {props.review}
                    </p>
                </div>
                <p className="antitext self-center m-3 ">
                    {props.rating}
                </p>
                <button className="" onClick={props.onDelete}><FontAwesomeIcon className={"text-gray-500"}
                                                                                         icon={faTrashCan}/></button>
            </div>

        </li>
    );
}



function Header(props) {
    return (
        <div className="bg-black min-h-20 fixed top-0 left-0 w-full flex flex-row">
            <button onClick={props.darkToggle} className="w-full maintext">Dark Mode</button>
            <h1 className="maintext text-4xl w-full text-center self-center">Album Tracker</h1>
            <a href="/account" className="maintext text-4xl w-full text-right mr-6 self-center">Account</a>
        </div>
    )
}

function Footer(props) {
    return (
        <div className="bg-black min-h-20 fixed bottom-0 left-0 w-screen flex justify-center">
            <button
                className="text-white rounded-md p-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={props.onCloseRequested}
            >
                Add Album Review
            </button>
        </div>

    )
}


function AddReviewForm(props) {
    const [albumName, setAlbumName] = React.useState('Album');
    const [artistName, setArtistName] = React.useState('Artist');
    const [rating, setRating] = React.useState('0');
    const [review, setReview] = React.useState('Review');
    return (
        <div>
            <input type="file" id="imageUpload" name="image" accept="image/*"/>
            <input
                className="border rounded-md p-2"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
            />
            <input
                className="border rounded-md p-2"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
            />
            <input
                className="border rounded-md p-2"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            <input
                className="border rounded-md p-2"
                value={review}
                onChange={(e) => setReview(e.target.value)}
            />
            <button
                className="text-white m-2 rounded-md p-1 bg-blue-600"
                onClick={() => {
                    props.onNewReview(albumName, artistName, rating, review);
                    setAlbumName('Album');
                    setReview('Artist');
                    setRating(0);
                    setReview('Review');
                }}
            >
                Add review
            </button>
            {props.isLoading ? <Spinner className="ml-2 mt-2"/> : null}
        </div>
    );
}

function Modal(props) {
    //console.log("Should we see the modal rn? " + props.openModal);
    const inputRef = useRef(null);

    function backgroundClose(e){
        if(!inputRef.current.contains(e.target)){
            props.closeModal();
        }
    }

    if(props.openModal){
        return (
            <div className="bg-black/20 w-[100vw] h-[100vh] fixed top-0 left-0 flex justify-center items-center"
            onClick={backgroundClose}>
                <div ref={inputRef} className="bg-white p-4 flex flex-col gap-4">
                    <header className="flex flex-row justify-between w-full">
                        <h1 className="whitespace-nowrap">{props.headerLabel}</h1>
                        <button className="ml-4 flex-shrink-0" aria-label="CloseS"
                        onClick={props.closeModal}>X</button>
                    </header>
                    {props.children}
                </div>
            </div>
        );
    }
    else{
        return null;
    }
}










