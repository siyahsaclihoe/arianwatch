import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';

interface User {
    id: string;
    username: string;
    email?: string;
    avatarUrl?: string;
    role: string;
    // add other fields as needed
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, userData: User, shouldRedirect?: boolean) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check localStorage on mount and verify token with backend
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // Verify token with backend
            api.get('/api/user/me')
                .then((res) => {
                    const { password, ...userData } = res.data;
                    setUser(userData);
                    setToken(storedToken);
                    // Update stored user data in case it changed
                    localStorage.setItem('user', JSON.stringify(userData));
                })
                .catch((error) => {
                    console.error("Token verification failed:", error);
                    // Invalid token - cleanup
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = (newToken: string, newUser: User, shouldRedirect = true) => {
        if (!newUser) {
            console.error("Login called without user data");
            return;
        }
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        // Token is now automatically attached by api interceptor

        if (shouldRedirect) {
            if (newUser.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        // Token removal from storage is sufficient; api interceptor checks localStorage
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
