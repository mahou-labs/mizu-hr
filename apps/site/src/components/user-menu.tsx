import { useEffect, useState } from "react";
import { authClient } from "../utils/auth-client";

// TODO: this is just a test placeholder
export function UserMenu() {
  const [session, setSession] = useState<
    undefined | ReturnType<typeof authClient.getSession>
  >();

  useEffect(() => {
    const getSession = async () => {
      const { data: authSession } = await authClient.getSession();
      if (authSession) {
        setSession(authSession);
      }
    };

    getSession();
  }, []);

  if (!session) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
    </div>
  );
}
