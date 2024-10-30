import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Unauthorized() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/profile");
    }, 3000);
  }, [router]);

  return (
    <div>
      <h1>Unauthorized Access</h1>
      <p>
        You do not have permission to access this page. Redirecting to home...
      </p>
    </div>
  );
}
