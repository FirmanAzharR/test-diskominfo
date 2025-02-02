export const isAuthenticated = () => {
    return localStorage.getItem("dataLogin") !== null; // Check if token exists
  };