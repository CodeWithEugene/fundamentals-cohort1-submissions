let url = import.meta.env.VITE_APP_CHECKOUT_BASE_URL

export const LoginApi = async (payload:any) => {
  const response = await fetch(`${url}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse?.message || errorResponse?.error || "Network response was not okay");
  }

  return response.json()
}