import { useEffect, useState } from "react";




export function useReviewFetching(imageId: string, authToken: string, delay=1000) {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedReviews, setFetchedReviews] = useState([]);
    useEffect(() => {
        setTimeout(async () => {
            console.log(authToken);
            const response = await fetch("/api/reviews", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`
                }
            });

            console.log("GET called");
            console.log("response", response);
            const data = await response.json();
            console.log(data);

            if (imageId === "") {
                setFetchedReviews(data);
            } else {
                setFetchedReviews(data.filter((image: { _id: string; }) => image._id === imageId));
            }
            setIsLoading(false);
        }, delay);
    }, [imageId, authToken]);

    return { isLoading, fetchedReviews };
}
