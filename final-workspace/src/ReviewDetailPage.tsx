import {Link, useLocation} from "react-router";
import React from "react";

interface AlbumReviewProps {
    id: string,
    artist: string,
    album: string,
    review: string,
    rating: string,
    onDelete: () => void,
    author: string
}

export function ReviewDetail() {
    const location = useLocation();
    const { review } = location.state as { review: AlbumReviewProps };

    return (
        <main>
            <AccountHeader></AccountHeader>
            <Spacer />
            <Spacer />
            <section className="p-4">
                <h1 className="text-2xl font-bold antitext">{review.album}</h1>
                <h2 className="text-xlantitext">{review.artist}</h2>
                <p className="antitext">{review.review}</p>
                <p className="antitext">Rating: {review.rating}</p>
                <p className="antitext">Reviewed by: {review.author}</p>
            </section>
        </main>
    );
}

function Spacer() {
    return (
        <div className="bg-black/0 min-h-20 top-0 left-0">

        </div>
    )
}

function AccountHeader() {
    return (
        <header className="bg-black min-h-20 fixed top-0 left-0 w-full flex flex-row">
            <nav>
                <Link to="/"
                      className="maintext text-4xl w-full text-left ml-6 self-center rounded-2xl p-1 fill">Main</Link>
            </nav>
            <h1 className="maintext text-4xl w-full text-center self-center">Album Tracker</h1>

        </header>);
}
