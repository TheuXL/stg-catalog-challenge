// src/pages/AuthPage.tsx
import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AuthPage = () => {
    const { session } = useAuth();
    const [tabIndex, setTabIndex] = useState(0);

    if (session) {
        return <Navigate to="/" replace />;
    }

    const handleForgotPasswordClick = () => {
        setTabIndex(2); // Muda para a aba de "Recuperar Senha"
    };
    
    const handleLoginSuccess = () => {
        setTabIndex(0); // Volta para a aba de Login
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                    <TabList>
                        <Tab>Entrar</Tab>
                        <Tab>Registrar</Tab>
                        <Tab>Recuperar Senha</Tab> 
                    </TabList>

                    <TabPanel>
                        <div className="pt-4">
                           <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                           <LoginForm onForgotPasswordClick={handleForgotPasswordClick} />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="pt-4">
                            <h2 className="text-2xl font-bold mb-4 text-center">Crie sua Conta</h2>
                            <RegisterForm />
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="pt-4">
                            <h2 className="text-2xl font-bold mb-4 text-center">Recuperar Senha</h2>
                            <ForgotPasswordForm onSuccess={handleLoginSuccess} />
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
};
