import React, { useState } from 'react';
import { FadeIn } from '../components/FadeIn';
import { Mail, Lock, ArrowRight, User, Loader2, Eye, EyeOff, CheckCircle2, Circle, KeyRound } from 'lucide-react';
import { auth, dbFirestore } from '../firebase'; 
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SignInView = ({ setUser, navigate }) => {
    // UI States
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false); // Naya State Forgot Password ke liye
    
    // Form States
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState(''); // Success message dikhane ke liye
    
    // Password Toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password Quality
    const hasLength = formData.password.length >= 8;
    const hasUpper = /[A-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const isPasswordValid = hasLength && hasUpper && hasNumber;

    const ADMIN_EMAIL = "sohaibrajpot22@outlook.com";

    // --- FORGOT PASSWORD LOGIC ---
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!formData.email) {
            setErrorMsg("Please enter your email address first.");
            return;
        }
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');
        try {
            await sendPasswordResetEmail(auth, formData.email);
            setSuccessMsg("Password reset link has been sent to your email!");
            setTimeout(() => setIsForgotPassword(false), 5000); // 5 sec baad wapas login pe
        } catch (error) {
            console.error("Reset Error:", error);
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- LOGIN / SIGNUP LOGIC ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            if (isLogin) {
                // Firebase Login
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                
                // NAYA: Check agar email verified nahi hai (Optional)
                if (!userCredential.user.emailVerified) {
                    setSuccessMsg("Note: Please verify your email for full access (Check your inbox).");
                }

                // Fetch User Role
                const userDoc = await getDoc(doc(dbFirestore, "users", userCredential.user.uid));
                let role = 'customer';
                
                if (userDoc.exists()) {
                    role = userDoc.data().role;
                } else if (formData.email === ADMIN_EMAIL) {
                    role = 'admin';
                }

                setUser({
                    name: userCredential.user.displayName || 'User',
                    email: userCredential.user.email,
                    uid: userCredential.user.uid,
                    role: role,
                    emailVerified: userCredential.user.emailVerified
                });
                
                navigate('home'); 
            } else {
                // Custom Checks for Sign Up
                if (formData.password !== formData.confirmPassword) {
                    setErrorMsg("Passwords do not match!");
                    setIsLoading(false); return;
                }
                if (!isPasswordValid) {
                    setErrorMsg("Please ensure your password meets all the security requirements.");
                    setIsLoading(false); return;
                }

                // Firebase Sign Up
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                
                await updateProfile(userCredential.user, {
                    displayName: formData.fullName
                });

                // NAYA: Send Verification Email
                await sendEmailVerification(userCredential.user);

                const userRole = formData.email === ADMIN_EMAIL ? 'admin' : 'customer';

                await setDoc(doc(dbFirestore, "users", userCredential.user.uid), {
                    name: formData.fullName,
                    email: formData.email,
                    role: userRole,
                    createdAt: new Date().toISOString()
                });

                setUser({
                    name: formData.fullName,
                    email: userCredential.user.email,
                    uid: userCredential.user.uid,
                    role: userRole,
                    emailVerified: false // Just signed up, so not verified yet
                });
                
                // Show Verification Toast instead of direct navigate if you want
                alert("Account created successfully! Please check your email to verify your account.");
                navigate('home');
            }
        } catch (error) {
            console.error("Auth Error:", error);
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setErrorMsg('Invalid email or password.');
            } else if (error.code === 'auth/email-already-in-use') {
                setErrorMsg('This email is already registered.');
            } else {
                setErrorMsg(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setIsForgotPassword(false);
        setErrorMsg('');
        setSuccessMsg('');
        setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center w-full px-2 sm:px-4 py-8">
            <FadeIn>
                <div className="glass-panel w-full max-w-md p-8 sm:p-10 rounded-[3rem] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mx-auto">
                    {/* Background glow effects */}
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-teal-500/20 blur-[50px] rounded-full pointer-events-none"></div>
                    <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-600/20 blur-[50px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 text-center mb-8">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-teal-400 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(45,212,191,0.4)]">
                            {isForgotPassword ? <KeyRound size={30} className="text-white" /> : <User size={30} className="text-white" />}
                        </div>
                        <h2 className="text-3xl font-black mb-2 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-200">
                            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back!' : 'Join Vintage')}
                        </h2>
                        <p className="text-[var(--text-muted)] text-sm">
                            {isForgotPassword 
                                ? 'Enter your email and we will send you a reset link.' 
                                : (isLogin ? 'Sign in to access your premium account.' : 'Create an account to unlock exclusive drops and features!')}
                        </p>
                    </div>

                    <form onSubmit={isForgotPassword ? handlePasswordReset : handleSubmit} className="relative z-10 space-y-5">
                        
                        {errorMsg && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm font-medium text-center">
                                {errorMsg}
                            </div>
                        )}
                        {successMsg && (
                            <div className="bg-teal-500/10 border border-teal-500/50 text-teal-400 px-4 py-3 rounded-xl text-sm font-medium text-center">
                                {successMsg}
                            </div>
                        )}

                        {!isLogin && !isForgotPassword && (
                            <div>
                                <div className="glass-panel bg-black/20 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-teal-400 focus-within:bg-white/10 transition-all">
                                    <User size={20} className="text-[var(--text-muted)] shrink-0" />
                                    <input type="text" placeholder="Nickname (for reviews)" required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="bg-transparent border-none outline-none text-[var(--text-main)] w-full text-base placeholder:text-[var(--text-muted)]" />
                                </div>
                            </div>
                        )}
                        
                        <div>
                            <div className="glass-panel bg-black/20 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-teal-400 focus-within:bg-white/10 transition-all">
                                <Mail size={20} className="text-[var(--text-muted)] shrink-0" />
                                <input type="email" placeholder="Email Address" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-transparent border-none outline-none text-[var(--text-main)] w-full text-base placeholder:text-[var(--text-muted)]" />
                            </div>
                        </div>

                        {/* Password fields only show if not in Forgot Password mode */}
                        {!isForgotPassword && (
                            <>
                                <div>
                                    <div className="glass-panel bg-black/20 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-teal-400 focus-within:bg-white/10 transition-all relative">
                                        <Lock size={20} className="text-[var(--text-muted)] shrink-0" />
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            placeholder="Password" 
                                            required 
                                            value={formData.password} 
                                            onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                            className="bg-transparent border-none outline-none text-[var(--text-main)] w-full text-base placeholder:text-[var(--text-muted)] pr-8" 
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-[var(--text-muted)] hover:text-teal-400 transition-colors">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {!isLogin && formData.password.length > 0 && (
                                    <div className="px-2 space-y-1 mt-2">
                                        <p className={`text-xs flex items-center gap-2 ${hasLength ? 'text-teal-400' : 'text-[var(--text-muted)]'}`}>
                                            {hasLength ? <CheckCircle2 size={14} /> : <Circle size={14} />} At least 8 characters
                                        </p>
                                        <p className={`text-xs flex items-center gap-2 ${hasUpper ? 'text-teal-400' : 'text-[var(--text-muted)]'}`}>
                                            {hasUpper ? <CheckCircle2 size={14} /> : <Circle size={14} />} At least one uppercase letter
                                        </p>
                                        <p className={`text-xs flex items-center gap-2 ${hasNumber ? 'text-teal-400' : 'text-[var(--text-muted)]'}`}>
                                            {hasNumber ? <CheckCircle2 size={14} /> : <Circle size={14} />} At least one number
                                        </p>
                                    </div>
                                )}

                                {!isLogin && (
                                    <div>
                                        <div className={`glass-panel bg-black/20 border rounded-2xl px-4 py-3 flex items-center gap-3 transition-all relative ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500/50 focus-within:bg-red-500/5' : 'border-white/10 focus-within:border-teal-400 focus-within:bg-white/10'}`}>
                                            <Lock size={20} className="text-[var(--text-muted)] shrink-0" />
                                            <input 
                                                type={showConfirmPassword ? "text" : "password"} 
                                                placeholder="Confirm Password" 
                                                required 
                                                value={formData.confirmPassword} 
                                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                                                className="bg-transparent border-none outline-none text-[var(--text-main)] w-full text-base placeholder:text-[var(--text-muted)] pr-8" 
                                            />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 text-[var(--text-muted)] hover:text-teal-400 transition-colors">
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {isLogin && (
                                    <div className="flex justify-end mt-2">
                                        <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        <button disabled={isLoading} type="submit" className="w-full glass-button bg-gradient-to-r from-teal-500/50 to-blue-600/50 hover:from-teal-500/80 hover:to-blue-600/80 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] mt-6 text-lg disabled:opacity-50">
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : (isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account'))} 
                            {!isLoading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="relative z-10 mt-8 text-center border-t border-white/10 pt-6">
                        {isForgotPassword ? (
                            <button onClick={() => setIsForgotPassword(false)} type="button" className="text-sm text-teal-300 hover:text-white transition font-semibold tracking-wide">
                                Back to Sign In
                            </button>
                        ) : (
                            <button onClick={toggleForm} type="button" className="text-sm text-teal-300 hover:text-white transition font-semibold tracking-wide">
                                {isLogin ? "Don't have an account? Sign up here!" : "Already have an account? Sign in!"}
                            </button>
                        )}
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};
export default SignInView;