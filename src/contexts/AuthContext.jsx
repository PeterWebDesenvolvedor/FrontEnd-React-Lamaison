// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        // throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Verifica se o usuário já está logado ao carregar a página
        const initAuth = async () => {
            const currentUser = authService.getCurrentUser();
            const token = localStorage.getItem('authToken');
            
            if (currentUser && token) {
                try {
                    // Opcional: verificar se o token ainda é válido
                    // await authService.verifyToken();
                    setUser(currentUser);
                } catch (error) {
                    // Token inválido - fazer logout
                    authService.logout();
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, senha) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login(email, senha);
            if (response.success) {
                setUser(response.user);
                return { success: true };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.register(userData);
            if (response.success) {
                return { success: true, user: response.user };
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};