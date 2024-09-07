import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContext } from '../../context/ToastContext';
import axios from 'axios';

const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

const Register = () => {
    const toast = useContext(ToastContext);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(false);
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

    const handleName = (e) => {
        setName(e);
        setNameError(e.length < 3);
    }

    const handleCreate = async () => {
        if (nameError || emailError || passwordError || !name || !email || !password) {
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Please check the form', life: 2000});
            return;
        }

        toast.current.show({severity: 'info', summary: 'Creating account', detail: 'Please wait...', life: 2000});

        await axios.post('/api/user', {
            name,
            email,
            password
        }).then(res => {
            if(res.data.status === 500){
                toast.current.show({severity: 'error', summary: 'Error', detail: res.data.message, life: 2000});
            }

            if(res.data.status === 200){
                toast.current.show({severity: 'success', summary: 'Success', detail: 'Account created successfully', life: 2000});

                setTimeout(() => {
                    navigate('/');
                }, 2500);
            }
        }).catch(() => {
            toast.current.show({severity: 'error', summary: 'Error', detail: 'An error occurred while creating the account', life: 2000});
        });
    }
    
    document.title = "Register";

    return (
        <div className="bg-gray-400 w-full h-full flex justify-center items-center">
            <div className="w-full sm:w-1/2 rounded-lg bg-white p-5">
                <h1 className="text-xl font-bold text-center text-sky-800 mb-10">Register your account</h1>
                <div className="grid">
                    <div className="grid mt-4">
                        <FloatLabel className="mb-4">
                            <InputText 
                                value={name} 
                                onChange={(e) => handleName(e.target.value)} 
                                className='border p-3 w-full' 
                                invalid={nameError}
                            />
                            <label htmlFor="name" className=''>Name</label>
                            {nameError && <small className='text-red-500'>Invalid name</small>}
                        </FloatLabel>
                    </div>
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
                                toggleMask
                            />
                            <label htmlFor="password" className=''>Password</label>
                            {passwordError && <small className='text-red-500'>Invalid password</small>}
                        </FloatLabel>
                    </div>
                </div>
                <div className="card-footer">
                    <Button
                        onClick={handleCreate}
                        label='Create account'
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    />

                    <Link 
                        to="/" 
                        className="w-full block bg-gray-400 hover:bg-gray-700 text-white text-center font-bold py-2 px-4 mt-2 rounded focus:outline-none focus:shadow-outline"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register;