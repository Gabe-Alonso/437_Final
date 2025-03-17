export async function sendPostRequest(url: string, payload: { name: string; password: string; }) {

    console.log(url, payload);
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: payload.name, password: payload.password }),
    });
    console.log("POST called");
    const data = await response.json();
    return { status: response.status, data };
}