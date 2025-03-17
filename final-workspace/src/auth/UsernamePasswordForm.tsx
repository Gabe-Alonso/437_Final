import { useState } from "react";

interface UsernamePasswordFormProps {
    onSubmit: (username: string, password: string) => void;
}

interface ResultState {
    type: "error" | "success";
    message: string;
}

export function UsernamePasswordForm({ onSubmit }: UsernamePasswordFormProps) {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [result, setResult] = useState<ResultState | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);

    const submitResult = async () => {
        await onSubmit(username, password);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("handleSubmit", username, password);

        if (!username || !password) {
            setResult({
                type: "error",
                message: "Please fill in your username and password.",
            });
            return;
        }

        setIsPending(true);
        try {
            await submitResult();
            setResult({
                type: "success",
                message: "You have successfully subscribed!",
            });
            setUsername("");
            setPassword("");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form className="antitext" onSubmit={handleSubmit}>
            <label>
                <input
                    className="antitext"
                    type="text"
                    name="username"
                    placeholder="Username"
                    disabled={isPending}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <label>
                <input
                    className="antitext"
                    type="password"
                    name="password"
                    placeholder="Password"
                    disabled={isPending}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <button className="antitext" type="submit" disabled={isPending}>Submit</button>
            {result?.type === "error" && (
                <p style={{ color: "red" }}>{result.message}</p>
            )}
        </form>
    );
}
