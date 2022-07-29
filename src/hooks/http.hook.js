import { useState, useCallback } from "react";

// Working with server, spinner and error
export const useHttp = () => {
    const [process, setProcess] = useState("waiting");

    // UseCallback, because it will be called in children. So they will not rerender every time
    const request = useCallback(
        async (
            url,
            method = "GET",
            body = null,
            headers = { "Content-Type": "application/json" }
        ) => {
            // Spinner in th begining
            setProcess("loading");

            // For probable errors with fetch
            try {
                const response = await fetch(url, { method, body, headers });

                if (!response.ok) {
                    throw new Error(
                        `Could not fetch ${url}, status: ${request.status}`
                    );
                }

                const data = await response.json();

                return data;
            } catch (e) {
                setProcess("error");
                throw e;
            }
        },
        []
    );
    // For clearing an error before next call from server
    const clearError = useCallback(() => {
        setProcess("loading");
    }, []);

    return { request, clearError, process, setProcess };
};