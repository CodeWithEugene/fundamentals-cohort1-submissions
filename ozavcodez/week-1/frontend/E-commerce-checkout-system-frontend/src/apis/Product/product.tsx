let url = import.meta.env.VITE_APP_CHECKOUT_BASE_URL;

// Function to redirect back to login if the user doesn't exist
const redirectToLogin = () => {
    window.location.href = '/login';
};


const getHeaders = async (isFormData = false) => {
    const tokenData = localStorage.getItem('token');
    if (!tokenData) {
        // Don't redirect immediately, throw an error to let the calling function handle it
        throw new Error("Authorization token is missing. Please log in again.");
    }
    const authKey = JSON.parse(tokenData).token;

    const headers: Record<string, string> = {
        "Authorization": `Bearer ${authKey}`,
    };

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
};

interface FetchWithAuthOptions extends RequestInit { }

export const fetchWithAuth = async (
    endpoint: string,
    options: FetchWithAuthOptions = {},
    isFormData: boolean = false
): Promise<any> => {
    try {
        const headers = await getHeaders(isFormData);
        const response = await fetch(`${url}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Don't redirect immediately; let the error be handled by the caller
                const errorResponse: { error?: string; message?: string } = await response.json();
                throw new Error(errorResponse?.error || errorResponse?.message || "Unauthorized access");
            }
            const errorResponse: { error?: string; message?: string } = await response.json();
            throw new Error(errorResponse?.error || errorResponse?.message || "Network response was not okay");
        }

        return response.json();
    } catch (error: any) {
        // Handle token expiration explicitly
        if (error.message.includes("Unauthorized access")) {
            // Optionally: Clear the token to force a login on manual retry
            localStorage.removeItem('token');
        }
        throw error; // Re-throw the error for the caller to handle
    }
};

export const getAllProducts = async () => {
    return fetchWithAuth("/api/getAllProducts");
}
export const getProductById = async (id: string) => {
    return fetchWithAuth(`/api/getProductById/${id}`);
}