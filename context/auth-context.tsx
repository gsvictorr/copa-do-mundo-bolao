"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type UserType = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
};

type AuthContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {}, 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/auth/user");
        const data = response.data;

        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
          router.push('/');
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);