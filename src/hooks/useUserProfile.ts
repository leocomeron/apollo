import { useEffect, useState } from 'react';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  description?: string;
  categories?: string[];
  isWorker: boolean;
  isVerified: boolean;
  documents?: Array<{
    type: string;
    url: string;
  }>;
  rating?: {
    average: number;
    total: number;
  };
}

interface UseUserProfileResult {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export const useUserProfile = (
  userId: string | undefined,
): UseUserProfileResult => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      return;
    }

    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${userId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Usuario no encontrado');
          }
          throw new Error('Error al cargar el perfil');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUser();
  }, [userId]);

  return { user, isLoading, error };
};
