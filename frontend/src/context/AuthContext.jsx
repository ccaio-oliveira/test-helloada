import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropTypes } from 'prop-types';
import Cookies from 'js-cookie';

const AuthContext = createContext({
    session: {
        logged: false,
        blocked: false,
        id: 0,
        name: '',
        email: '',
        token: '',
    },
    hash: '',
    headers: {},

    handleSetSession: () => {},
    handleSetHash: () => {},
    handleValidateSession: () => {},
    handleSetHeaders: () => {},
});

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    const [session, setSession] = useState({
        logged: false,
        blocked: false,
        id: 0,
        name: '',
        email: '',
        token: '',
    });
    
    const [headers, setHeaders] = useState({});
    const [hash, setHash] = useState('');

    const handleSetSession = (session) => {
        setSession(session);

        Cookies.set('sessionSaved', JSON.stringify({
            ...session
        }), {expires: 7});
    }

    const handleSetHash = (hash) => {
        setHash(hash);
    }

    const handleSetHeaders = () => {
        setHeaders({
            Authorization: `Bearer ${session.token}`,
            'Access-Control-Allow-Origin': '*',
        });
    }

    const handleValidateSession = () => {
        let sessionSaved = Cookies.get('sessionSaved') || '';
        sessionSaved = sessionSaved ? JSON.parse(sessionSaved) : null;

        if (sessionSaved !== null && session.logged === false) {
            handleSetSession(sessionSaved);
        } else if (sessionSaved === null){
            navigate('/');
        }
    }

    const context = {
        session,
        hash,
        headers,
        handleSetSession,
        handleSetHash,
        handleValidateSession,
        handleSetHeaders,
    };

    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
    );
}

const useAuth = () => {
    const context = useContext(AuthContext);

    if(!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthProvider, useAuth };