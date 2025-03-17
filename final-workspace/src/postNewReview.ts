export async function postNewReview(authToken: string, payload: { _id: string,
    album: string,
    artist: string,
    rating: string,
    review: string,
    author: string}) {

    console.log("Post new review ts: ", payload);
    const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`},
        body: JSON.stringify({ _id: payload._id,
            album: payload.album,
            artist: payload.artist,
            rating: payload.rating,
            review: payload.review,
            author: payload.author }),
    });
    console.log("POST called");
    // console.log(response);
    // const data = await response.json();
    // return { status: response.status, data };
}