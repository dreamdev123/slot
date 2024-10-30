"use client"

import { useEffect, useState } from 'react';
import { authedOnly } from "../../../lib/auth2"
import LogOutButton from "../components/logout-button";

const AuthenticatedPage = () => {
  const [parsedJWT, setParsedJWT] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await authedOnly();
        setParsedJWT(result);
      } catch (error) {
        console.error("Authentication error:", error);
        // Redirect to login page if there's an error
        window.location.href = "/login2";
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Authenticated Page</h1>
      {parsedJWT && <p>You are authenticated, {parsedJWT.sub}!</p>}
      <hr />
      <LogOutButton />
    </div>
  );
};

export default AuthenticatedPage;