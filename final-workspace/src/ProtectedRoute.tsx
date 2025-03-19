import { Navigate } from "react-router";

export function ProtectedRoute(props: { authToken: any; children: any; }) {
    // eslint-disable-next-line react/prop-types
    if (!props.authToken) {
        return <Navigate to="/login" replace />
    }

    // eslint-disable-next-line react/prop-types
    return props.children;
}