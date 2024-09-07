import { createContext, useRef } from "react";
import { Toast } from 'primereact/toast';
import { PropTypes } from 'prop-types';

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
    const toast = useRef(null);

    return (
        <ToastContext.Provider value={toast}>
            <Toast ref={toast} />
            {children}
        </ToastContext.Provider>
    )
}

ToastProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { ToastProvider, ToastContext };