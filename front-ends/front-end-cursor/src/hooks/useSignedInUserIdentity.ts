import { useEffect, useState } from 'react';
import { fetchUserPersonName } from '../api/postgrest';
import { useAuth } from './useAuth';
import { signedInUserDesktopLabel, signedInUserInitials } from '../utils/userInitials';

type SignedInUserIdentity = {
  initials: string;
  desktopLabel: string;
};

const EMPTY_IDENTITY: SignedInUserIdentity = { initials: '', desktopLabel: '' };

function identityFromName(name: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}): SignedInUserIdentity {
  return {
    initials: signedInUserInitials(name),
    desktopLabel: signedInUserDesktopLabel(name),
  };
}

/**
 * Signed-in header identity. Initials are for iPad-size and smaller.
 * `desktopLabel` is `Logged in user: <first initial> <last name>`.
 */
export function useSignedInUserIdentity(): SignedInUserIdentity {
  const { session } = useAuth();
  const [identity, setIdentity] = useState<SignedInUserIdentity>(EMPTY_IDENTITY);

  useEffect(() => {
    if (!session) {
      setIdentity(EMPTY_IDENTITY);
      return;
    }

    const username = session.username;
    const fallback = identityFromName({ username });
    setIdentity(fallback);

    let cancelled = false;
    void fetchUserPersonName(session.user_id)
      .then((name) => {
        if (!cancelled) {
          setIdentity(identityFromName({ ...name, username }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIdentity(fallback);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  return identity;
}
