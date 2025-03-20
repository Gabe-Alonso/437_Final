import React, {useState} from 'react'
import './App.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashCan} from '@fortawesome/free-solid-svg-icons'
import {nanoid} from "nanoid";
import {useRef} from 'react';
import {Spinner} from "./assets/Spinner.js";
import {Spacer} from "./Spacer.tsx";
import "./tokens.css";
import "./index.css";
import {Link, useNavigate} from "react-router";
import {postNewReview} from "./postNewReview.ts";
import {useReviewFetching} from "./useReviewFetching.ts";


interface review {
    _id: string;
    album: string;
    artist: string;
    rating: string;
    review: string;
    author: string;
}

interface MainPageProps {
    reviews: review[];
    darkToggle: () => void;
    isLoading: boolean;
    authToken: string;
}

export function MainPage(props: MainPageProps) {
    const [reviews, setReviews] = React.useState(props.reviews);

    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    //console.log("Immediate variable is " + isOpen);

    React.useEffect(() => {
        fetchData(props.authToken);
    }, [props.authToken]); // Runs when the component mounts or authToken changes

    console.log("reviews in mainPage", reviews);

    const reviewList = reviews?.map((review) => (
        <AlbumReview
            id={review._id}
            album={review.album}
            artist={review.artist}
            rating={review.rating}
            review={review.review}
            author={review.author}
            key={review._id}
            onDelete={() => deleteReview(review._id)}
        />
    ));

    function addReview(album = "Album", artist = "Artist", rating = "0", review = "Review", author = "Author") {
        const newReview = {_id: nanoid(), album, artist, rating, review, author};

        postNewReview(props.authToken, newReview).then(() => {
            // Instead of refetching, optimistically update state
            fetchData(props.authToken);
            //setReviews((prevReviews) => [...prevReviews, newReview]);
        });
    }


    function delayMs(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function fetchData(authToken?: string) {
        setIsLoading(true);
        console.log("Loading...");

        try {
            if (authToken) {
                const response = await fetch("/api/reviews", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch reviews");
                }

                const fetchedReviews = await response.json();
                console.log("Fetched Reviews:", fetchedReviews);

                // Store the fetched reviews as raw objects in state
                setReviews(fetchedReviews);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsLoading(false);
            console.log("Done Loading");
            setIsOpen(false);
        }
    }


    function onCloseRequested() {
        const newModalStatus = !isOpen;
        setIsOpen(newModalStatus);
    }


    function deleteReview(id: string) {
        // Optimistically update the UI
        setReviews(prevReviews => prevReviews.filter(review => review._id !== id));

        // Send DELETE request to backend
        fetch(`/api/reviews/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.authToken}` // if you are using auth
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to delete review");
                }
                return response.json();
            })
            .then(data => {
                console.log("Review deleted from backend:", data);
            })
            .catch(error => {
                console.error("Error deleting review:", error);
                // Optionally revert UI update here if necessary
            });
    }



    const addFormHeader = "New Review";
    //console.log("Before returning the app, the modal is " + isOpen);
    return (
        <main className="m-4"> {/* Tailwind: margin level 4 on all sides */}
            <Header darkToggle={props.darkToggle}></Header>

            <Spacer></Spacer>
            <Spacer></Spacer>
            <Modal
                headerLabel={addFormHeader}
                openModal={isOpen}
                closeModal={onCloseRequested}
            >
                <AddReviewForm onNewReview={addReview} isLoading={isLoading} id={''} artist={''} album={''} review={''}
                               rating={"0"}/>
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
            <Footer onCloseRequested={onCloseRequested}> </Footer>
        </main>
    );

}

interface AlbumReviewProps {
    id: string,
    artist: string,
    album: string,
    review: string,
    rating: string,
    onDelete: () => void,
    author: string
}

function AlbumReview(props: AlbumReviewProps) {
    const navigate = useNavigate();
    const handleClick = () => {
        // Create a serializable review object, excluding non-serializable props (like functions)
        const { onDelete, ...reviewData } = props;
        navigate(`/review/${props.id}`, { state: { review: reviewData } });
    };

    return (
        <li className="mb-4">
            <article className="flex items-center justify-between" aria-labelledby={`review-${props.id}`}>
                <button type="button" onClick={handleClick} className="flex flex-1 cursor-pointer text-left focus:outline-none">
                    <figure className="flex flex-row p-1 reviewbackground rounded-2xl p-2">
                        <img src="src/album_placeholder.png" alt={`Album cover for ${props.album}`} width="75" className="rounded-2xl mr-3" />
                        <figcaption className="flex flex-col">
                            <p id={`review-${props.id}`} className="antitext">{props.artist}</p>
                            <p className="antitext">{props.album}</p>
                        </figcaption>
                        <p className="antitext self-center m-3">{props.rating}</p>
                        <p className="antitext self-center m-3">{props.author}</p>
                    </figure>
                </button>
                <button type="button" className="ml-2" onClick={props.onDelete} aria-label="Delete review">
                    <FontAwesomeIcon className="text-gray-500" icon={faTrashCan} />
                </button>
            </article>
        </li>
    );
}

interface HeaderProps {
    darkToggle: () => void;
}

function Header(props: HeaderProps) {
    return (
        <header className="bg-black min-h-20 fixed top-0 left-0 w-full flex flex-row">
            <button onClick={props.darkToggle} className="w-full maintext">Dark Mode</button>
            <h1 className="maintext text-4xl w-full text-center self-center">Album Tracker</h1>
            <Link to="/Account" className="maintext text-4xl w-full text-right mr-6 self-center">Account</Link>
        </header>
    )
}

interface FooterProps {
    onCloseRequested: () => void;
    children?: React.ReactNode;
}

function Footer(props: FooterProps) {
    return (
        <footer className="bg-black min-h-20 fixed bottom-0 left-0 w-screen flex justify-center">
            <button
                className="text-white rounded-md p-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={props.onCloseRequested}
            >
                Add Album Review
            </button>
        </footer>

    )
}

interface AddReviewProps {
    id: string;
    artist: string;
    album: string;
    review: string;
    rating: string;
    onNewReview: (albumName: string, artistName: string, rating: string, review: string) => void;
    isLoading: boolean;
}

function AddReviewForm(props: AddReviewProps): JSX.Element {
    const [albumName, setAlbumName] = React.useState('Album');
    const [artistName, setArtistName] = React.useState('Artist');
    const [rating, setRating] = React.useState('0');
    const [review, setReview] = React.useState('Review');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.onNewReview(albumName, artistName, rating, review);
        setAlbumName('Album');
        setArtistName('Artist');
        setRating("0");
        setReview('Review');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            <div>
                <label htmlFor="albumName">Album Name:</label>
                <input
                    id="albumName"
                    type="text"
                    className="border rounded-md p-2"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="artistName">Artist Name:</label>
                <input
                    id="artistName"
                    type="text"
                    className="border rounded-md p-2"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="rating">Rating:</label>
                <input
                    id="rating"
                    type="text"
                    className="border rounded-md p-2"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="reviewText">Review:</label>
                <input
                    id="reviewText"
                    type="text"
                    className="border rounded-md p-2"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
            </div>
            <button type="submit" className="text-white m-2 rounded-md p-1 bg-blue-600 focus:outline-none">
                Add review
            </button>
            {props.isLoading && <Spinner className="ml-2 mt-2" />}
        </form>
    );
}

interface ModalProps {
    closeModal: () => void;
    openModal: boolean;
    headerLabel: string;
    children?: React.ReactNode;
}

function Modal(props: ModalProps) {
    const inputRef = useRef<HTMLDivElement>(null);

    function backgroundClose(e: React.MouseEvent<HTMLDivElement>) {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
            props.closeModal();
        }
    }

    if (props.openModal) {
        return (
            <section
                role="dialog"
                aria-labelledby="modal-header"
                aria-modal="true"
                className="bg-black/20 w-[100vw] h-[100vh] fixed top-0 left-0 flex justify-center items-center"
                onClick={backgroundClose}
            >
                <div ref={inputRef} className="modal p-4 flex flex-col gap-4">
                    <header className="flex flex-row justify-between w-full">
                        <h1 className="whitespace-nowrap">{props.headerLabel}</h1>
                        <button
                            className="ml-4 flex-shrink-0"
                            aria-label="Close"
                            onClick={props.closeModal}
                        >
                            X
                        </button>
                    </header>
                    {props.children}
                </div>
            </section>
        );
    } else {
        return null;
    }
}










