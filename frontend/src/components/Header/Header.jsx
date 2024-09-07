import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useContext, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { ToastContext } from "../../context/ToastContext";
import Cookies from 'js-cookie';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const toast = useContext(ToastContext);
    const { session } = useAuth();
    const menuRight = useRef(null);
    const navigate = useNavigate();
    const items = [
        {
            label: session.name,
            items: [
                {
                    label: 'Logout',
                    icon: 'pi pi-fw pi-power-off',
                    command: () => handleLogout()
                }
            ]
        }
    ];

    const handleLogout = async () => {
        toast.current.show({severity: 'info', summary: 'Logging out', detail: 'Please wait...', life: 2000});

        // Logout logic here
        await axios.post('/api/logout').then(res => {
            toast.current.show({severity: 'success', summary: 'Success', detail: res.data.message, life: 2000});
            Cookies.remove('sessionSaved');
            navigate('/');
        }).catch(err => {
            toast.current.show({severity: 'error', summary: 'Error', detail: err.response.data.message, life: 2000});
        });
    }

    return (
        <header className="header p-5 flex justify-between border-b shadow-md">
            <div className="title cursor-default">
                <h1 className="text-xl font-bold">Task Manager</h1>
            </div>
            <div className="menu">
                <Button icon="pi pi-user" className="mr-7 bg-gray-200 p-2" onClick={(event) => menuRight.current.toggle(event)} aria-controls="popup_menu_right" aria-haspopup />
                <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
            </div>
        </header>
    )
}

export default Header;