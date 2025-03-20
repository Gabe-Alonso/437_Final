import { useLocation } from "react-router";

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
        <div className="p-4">
            <h1 className="text-2xl font-bold antitext">{review.album}</h1>
            <h2 className="text-xlantitext">{review.artist}</h2>
            <p className="antitext">{review.review}</p>
            <p className="antitext">Rating: {review.rating}</p>
            <p className="antitext">Reviewed by: {review.author}</p>
        </div>
    );
}
