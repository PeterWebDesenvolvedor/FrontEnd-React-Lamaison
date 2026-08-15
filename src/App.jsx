// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './Routes';
import './css/global.css';

function App() {
    return (
        <Router> {/* O Router primeiro */}
            <AuthProvider> {/* O Provider dentro do Router */}
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;