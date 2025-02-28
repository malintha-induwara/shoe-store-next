import { Suspense } from "react";
import Login from "./ui/login-form";
import LoadingSpinner from "./ui/loading-spinner";

export default function Home() {
  return (
    <main>
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    </main>
  );
}
