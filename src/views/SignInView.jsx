import React, { useState } from 'react';
import { FadeIn } from '../components/FadeIn';
import { Mail, Lock, ArrowRight, User, Loader2 } from 'lucide-react';
import { auth } from '../firebase'; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const SignInView = ({ setIsLoggedIn, setUserNickname, navigate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    
    // Nayi states Loading aur Error ke liye
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            if (isLogin) {
                // Firebase Login
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                setUserNickname(userCredential.user.displayName || 'User');
                setIsLoggedIn(true);
                navigate('home'); 
            } else {
                // Firebase Sign Up
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                
                // Save Nickname to Firebase Profile
                await updateProfile(userCredential.user, {
                    displayName: formData.fullName
                });

                setUserNickname(formData.fullName);
                setIsLoggedIn(true);
                navigate('home');
            }
        } catch (error) {
            console.error("Auth Error:", error);
            // Custom Error Messages
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setErrorMsg('Invalid email or password.');
            } else if (error.code === 'auth/email-already-in-use') {
                setErrorMsg('This email is already registered.');
            } else if (error.code === 'auth/weak-password') {
                setErrorMsg('Password should be at least 6 characters.');
            } else {
                setErrorMsg(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center w-full px-2 sm:px-4 py-8">
            <FadeIn>
                <div className="glass-panel w-full max-w-md p-8 sm:p-10 rounded-[3rem] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-auto">
                    {/* Cool Glowing Background Orbs */}
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-teal-500/20 blur-[50px] rounded-full pointer-events-none"></div>
                    <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-600/20 blur-[50px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 text-center mb-8">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-teal-400 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(45,212,191,0.4)]">
                            <User size={30} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black mb-2 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-200">
                            {isLogin ? 'Welcome Back!' : 'Join Glass'}
                        </h2>
                        <p className="text-[var(--text-muted)] text-sm">
                            {isLogin ? 'Sign in to access your premium account.' : 'Create an account to unlock exclusive drops and features!'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                        
                        {/* Error Message Box */}
                        {errorMsg && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-medium text-center">
                                {errorMsg}
                            </div>
                        )}

                        {!isLogin && (
                            <div>
                                <div className="glass-panel bg-black/20 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-teal-400 focus-within:bg-white/10 transition-all">
                                    <User size={20} className="text-[var(--text-muted)]" />
                                    <input type="text" placeholder="Nickname (for reviews)" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="bg-transparent border-none outline-none text-[var(--text-main)] w-full text-base placeholder:text-[var(--text-muted)]" />
                                </div>
                            </div>
                        )}
                        <div>
                            <div className="glass-panel bg-black/20 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-teal-400 focus-within:bg-white/10 transition-all">
                                <Mail size={20} className="text-[var(--text-muted)]" />
                                <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-transparent border-none outline-none text-[var(--text-main)] w-full text-base placeholder:text-[var(--text-muted)]" />
                            </div>
                        </div>
                        <div>
                            <div className="glass-panel bg-black/20 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-teal-400 focus-within:bg-white/10 transition-all">
                                <Lock size={20} className="text-[var(--text-muted)]" />
                                <input type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="bg-transparent border-none outline-none text-[var(--text-main)] w-full text-base placeholder:text-[var(--text-muted)]" />
                            </div>
                        </div>

                        <button disabled={isLoading} type="submit" className="w-full glass-button bg-gradient-to-r from-teal-500/50 to-blue-600/50 hover:from-teal-500/80 hover:to-blue-600/80 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] mt-6 text-lg disabled:opacity-50">
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')} 
                            {!isLoading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="relative z-10 mt-8 text-center border-t border-white/10 pt-6">
                        <button onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }} type="button" className="text-sm text-teal-300 hover:text-white transition font-semibold tracking-wide">
                            {isLogin ? "Don't have an account? Sign up here!" : "Already have an account? Sign in!"}
                        </button>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};
export default SignInView;