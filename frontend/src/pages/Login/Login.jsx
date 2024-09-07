import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContext } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';

const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const Login = () => {
    const toast = useContext(ToastContext);
    const { handleSetSession } = useAuth();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e);
        setEmailError(!validateEmail(e));
    }

    const handlePassword = (e) => {
        setPassword(e);
        setPasswordError(e.length < 8);
    }

    const handleLogin = async () => {
        if (emailError || passwordError || !email || !password) {
            return;
        }

        toast.current.show({severity: 'info', summary: 'Logging in', detail: 'Please wait...', life: 2000});

        // Login logic here
        await axios.post('/api/login', {
            email: email.trim(),
            password: password.trim()
        }).then(res => {
            axios.get('/sanctum/csrf-cookie').then(() => {
                setEmail('');
                setPassword('');

                toast.current.show({severity: 'success', summary: 'Success', detail: res.data.message, life: 2000});

                handleSetSession({
                    logged: true,
                    blocked: false,
                    token: res.data.token,
                    ...res.data.user
                });

                Cookies.set('sessionSaved', JSON.stringify({
                    logged: true,
                    blocked: false,
                    token: res.data.token,
                    ...res.data.user
                }), { expires: 7 });

                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            })
        }).catch(err => {
            toast.current.show({severity: 'error', summary: 'Error', detail: err.response.data.message, life: 3000});
        });
    }
    
    document.title = "Login";

    return (
        <div className="bg-gray-400 w-full h-full flex justify-center items-center">
            <div className="w-full sm:w-1/2 rounded-lg bg-white p-5">
                <h1 className="text-xl font-bold text-center text-sky-800 mb-10">Login to your dashboard</h1>
                <div className="grid">
                    <div className="grid mt-4">
                        <FloatLabel className="mb-4">
                            <InputText 
                                value={email} 
                                onChange={(e) => handleEmail(e.target.value)} 
                                className='border p-3 w-full' 
                                invalid={emailError}
                            />
                            <label htmlFor="email" className=''>Email</label>
                            {emailError && <small className='text-red-500'>Invalid email</small>}
                        </FloatLabel>
                    </div>
                    <div className="grid mt-4">
                        <FloatLabel className="mb-4">
                            <Password 
                                value={password} 
                                onChange={(e) => handlePassword(e.target.value)} 
                                className='w-full'
                                inputClassName='border p-3 w-full'
                                feedback={false} tabIndex={1} 
                                invalid={passwordError}
                                toggleMask
                            />
                            <label htmlFor="password" className=''>Password</label>
                            {passwordError && <small className='text-red-500'>Invalid password</small>}
                        </FloatLabel>
                    </div>
                </div>
                <div className="card-footer">
                    <Button
                        onClick={handleLogin}
                        label='Submit'
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    />

                    <div className="text-center mt-4">
                        <p>
                            Dont have an account? <Link to="/register" className="text-blue-500">Create one here!</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;