import React, { useState, useEffect, createContext, useContext, useMemo, useRef } from 'react';
import { Star, Heart, ShoppingCart, Search, Menu, X, ChevronLeft, ChevronRight, Trash2, Sparkles, User, Lock, Mail, Sun, Moon, CreditCard, Smartphone, Truck, CheckCircle, Loader, MapPin, Repeat, Tag, ShieldCheck, Zap } from 'lucide-react';
import sonyHeadphones from './assets/images/sony.jpeg';
import iphone15Pro from './assets/images/iPhone-15-Pro-Lineup-Feature.jpg';
import denimJacket from './assets/images/Unknown 7.49.37 PM.jpeg';
import samsungs24 from './assets/images/in-galaxy-s24-s928-sm-s928bztwins-539573349.jpg';
import nike from './assets/images/nike-air-max-pulse-outdoor-09-22259853-main.jpg.webp';
import maxi from './assets/images/maxi.jpeg';
import chair from './assets/images/chair.png.webp';
import table from './assets/images/table.jpeg';
import { motion, AnimatePresence } from 'framer-motion';

// --- EXPANDED MOCK API & DATA WITH REVIEWS & DESCRIPTIONS ---
const sampleProducts = [
    {
        id: 1,
        name: 'Sony WH-1000XM5 Headphones',
        category: 'Electronics',
        price: 29990,
        rating: 4.8,
        availability: 'In Stock',
        description: 'Immerse yourself in a world of pure, uninterrupted sound with the Sony WH-1000XM5. Featuring industry-leading noise cancellation powered by dual processors and eight microphones, these headphones deliver an unparalleled listening experience. The lightweight, comfortable design is perfect for all-day wear, while the 30-hour battery life ensures your music never stops.',
        images: [sonyHeadphones],
        featured: true,
        reviews: [
            { user: 'Aarav', rating: 5, comment: 'Absolutely mind-blowing noise cancellation. Worth every penny!' },
            { user: 'Priya', rating: 5, comment: 'So comfortable I forget I\'m wearing them. The sound is crystal clear.' },
        ],
    },
    {
        id: 2,
        name: 'Apple iPhone 15 Pro',
        category: 'Electronics',
        price: 134900,
        rating: 4.9,
        availability: 'In Stock',
        description: 'Experience the pinnacle of mobile technology with the iPhone 15 Pro. Forged in aerospace-grade titanium, it\'s the lightest Pro model ever. The groundbreaking A17 Pro chip delivers game-changing performance, while the customizable Action button and a more versatile Pro camera system unlock new creative possibilities.',
        images: [iphone15Pro],
        featured: true,
        reviews: [
            { user: 'Ananya', rating: 5, comment: 'The camera is just incredible. The photos look professional.' },
            { user: 'Kabir', rating: 5, comment: 'So fast and responsive. The titanium design feels amazing in hand.' },
        ],
    },
    {
        id: 3,
        name: 'Classic Denim Jacket',
        category: 'Fashion',
        price: 3499,
        rating: 4.5,
        availability: 'In Stock',
        description: 'A timeless wardrobe staple, this denim jacket is crafted from 100% premium, durable cotton. Its versatile design features a classic collar, button-front closure, and four functional pockets. Perfect for layering in any season, it adds a touch of effortless cool to any outfit.',
        images: [denimJacket],
        featured: true,
        reviews: [
            { user: 'Diya', rating: 5, comment: 'The perfect fit! Not too tight, not too loose. Great quality denim.' },
        ],
    },
    {
        id: 4,
        name: 'Minimalist Coffee Table',
        category: 'Home',
        price: 8999,
        rating: 4.7,
        availability: 'In Stock',
        description: 'Elevate your living space with this sleek and functional coffee table. Featuring a durable solid oak wood top and sturdy, black powder-coated metal legs, its minimalist design complements any modern or industrial decor. The spacious surface is perfect for your books, magazines, and morning coffee.',
        images: [table],
        featured: true,
        reviews: [
            { user: 'Riya', rating: 5, comment: 'Looks even better in person. Very sturdy and was easy to assemble.' },
        ],
    },
    { id: 5, name: 'Samsung Galaxy S24 Ultra', category: 'Electronics', price: 129999, rating: 4.8, availability: 'In Stock', description: 'Unleash new levels of creativity and productivity with the Galaxy S24 Ultra. Featuring the revolutionary Galaxy AI, a stunning Dynamic AMOLED 2X display, and an integrated S Pen, this phone is designed to redefine your mobile experience.', images: [samsungs24], featured: false, reviews: [{user: 'Aisha', rating: 5, comment: 'The AI features are incredible! Circle to Search is a game changer.'}]},
    { id: 6, name: 'Floral Maxi Dress', category: 'Fashion', price: 2799, rating: 4.6, availability: 'In Stock', description: 'A beautiful and breezy dress perfect for summer brunches or beach vacations.', images: [maxi], featured: false, reviews: [{user: 'Kiara', rating: 5, comment: 'So comfortable and pretty! I get compliments every time I wear it.'}]},
    { id: 7, name: 'Ergonomic Office Chair', category: 'Home', price: 14999, rating: 4.9, availability: 'Out of Stock', description: 'Upgrade your home office with this premium ergonomic chair. Designed for maximum comfort and support, it features adjustable lumbar support, armrests, and a breathable mesh back to keep you comfortable during long workdays.', images: [chair], featured: false, reviews: [{user: 'Leo', rating: 5, comment: 'My back pain is gone. This chair is a lifesaver.'}]},
    { id: 8, name: 'Nike Air Max Pulse', category: 'Fashion', price: 11895, rating: 4.7, availability: 'In Stock', description: 'Inspired by the London music scene, the Air Max Pulse brings an underground touch to the iconic Air Max line. Its point-loaded cushioning, revamped from the incredibly plush Air Max 270, delivers better bounce and responsiveness.', images: [nike], featured: true, reviews: [{user: 'Vivaan', rating: 5, comment: 'Super comfortable and they look amazing.'}]},
];

const mockApi = {
    getProducts: async () => { await new Promise(r => setTimeout(r, 500)); return sampleProducts; },
    getProductById: async (id) => { await new Promise(r => setTimeout(r, 500)); return sampleProducts.find(p => p.id === parseInt(id)); },
    getFeaturedProducts: async () => { await new Promise(r => setTimeout(r, 500)); return sampleProducts.filter(p => p.featured); }
};

// --- UTILS ---
const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

// --- CONTEXT ---
const CartContext = createContext();
const AuthContext = createContext();
const ThemeContext = createContext();
const WishlistContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const item = prev.find(i => i.product.id === product.id);
            return item ? prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i) : [...prev, { product, quantity }];
        });
    };
    const removeFromCart = (id) => setCart(prev => prev.filter(i => i.product.id !== id));
    const updateQuantity = (id, q) => { if (q <= 0) { removeFromCart(id); return; } setCart(prev => prev.map(i => i.product.id === id ? { ...i, quantity: q } : i)); };
    const clearCart = () => setCart([]);
    const cartCount = useMemo(() => cart.reduce((c, i) => c + i.quantity, 0), [cart]);
    const cartTotal = useMemo(() => cart.reduce((t, i) => t + i.product.price * i.quantity, 0), [cart]);
    return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal, clearCart }}>{children}</CartContext.Provider>;
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);

    const login = (email, pass) => {
        setUser({ name: 'Alex Ray', email, age: 30, sex: 'Male' });
        setOrderHistory([
            { id: 'ORD123', date: '2024-07-15', total: 3499, items: [sampleProducts.find(p => p.id === 3)] },
            { id: 'ORD124', date: '2024-06-20', total: 29990, items: [sampleProducts.find(p => p.id === 1)] },
        ]);
        setIsNewUser(false);
    };
    const logout = () => { setUser(null); setOrderHistory([]); };
    const signup = (name, email, pass) => {
        setUser({ name, email, age: null, sex: null });
        setIsNewUser(true);
    };
    const updateUserProfile = (details) => {
        setUser(prev => ({ ...prev, ...details }));
        setIsNewUser(false);
    };
    
    const openAuthModal = () => setIsAuthModalOpen(true);
    const closeAuthModal = () => setIsAuthModalOpen(false);
    const isAuthenticated = !!user;
    return <AuthContext.Provider value={{ user, orderHistory, login, logout, signup, isAuthenticated, isAuthModalOpen, openAuthModal, closeAuthModal, isNewUser, updateUserProfile }}>{children}</AuthContext.Provider>;
};

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const addToWishlist = (product) => {
        setWishlist(prev => [...prev, product]);
    };
    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(p => p.id !== productId));
    };
    const isInWishlist = (productId) => {
        return wishlist.some(p => p.id === productId);
    };
    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };
    return <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>{children}</WishlistContext.Provider>;
};

// --- HOOKS ---
const useCart = () => useContext(CartContext);
const useAuth = () => useContext(AuthContext);
const useTheme = () => useContext(ThemeContext);
const useWishlist = () => useContext(WishlistContext);

// --- ANIMATION VARIANTS ---
const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.5 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };
const staggerItem = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

// --- COMPONENTS ---

const Header = ({ setView, searchQuery, setSearchQuery }) => {
    const { cartCount } = useCart();
    const { isAuthenticated, user, logout, openAuthModal } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-colors">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'home' }); }} className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">SwiftBasket</a>
                    
                    <div className="hidden md:flex items-center space-x-4 flex-1 max-w-xl">
                        <div className="relative w-full">
                            <input 
                                type="text" 
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-100 dark:bg-gray-800 border-transparent rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
                        </button>
                        {isAuthenticated ? (
                            <div className="relative group hidden sm:block"><button className="font-semibold text-gray-700 dark:text-gray-200">{user.name}</button><div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"><a href="#" onClick={(e) => {e.preventDefault(); setView({page: 'account'})}} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">My Account</a><a href="#" onClick={logout} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</a></div></div>
                        ) : (
                            <button onClick={openAuthModal} className="hidden sm:block bg-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition-transform hover:scale-105">Login / Sign Up</button>
                        )}
                        <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'wishlist' }); }} className="relative text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400"><Heart size={28} /></a>
                        <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'cart' }); }} className="relative text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"><ShoppingCart size={28} />{cartCount > 0 && (<span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">{cartCount}</span>)}</a>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="px-4 pt-2 pb-4 space-y-2">
                            <div className="relative w-full my-2">
                                <input 
                                    type="text" 
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                            {isAuthenticated ? (
                                <>
                                <div className="py-2 px-3 font-semibold text-gray-800 dark:text-white">Welcome, {user.name}</div>
                                <a href="#" onClick={(e) => {e.preventDefault(); setView({page: 'account'}); setIsMenuOpen(false);}} className="block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">My Account</a>
                                <a href="#" onClick={() => { logout(); setIsMenuOpen(false); }} className="block py-2 px-3 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Logout</a>
                                </>
                            ) : (
                                <button onClick={() => { openAuthModal(); setIsMenuOpen(false); }} className="w-full text-left bg-indigo-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-indigo-700">Login / Sign Up</button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

const ProductCard = ({ product, setView }) => {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    return (
        <motion.div variants={staggerItem} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group">
            <div className="relative">
                <img src={product.images[0]} alt={product.name} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-0 left-0 w-full h-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                    <button onClick={() => addToCart(product)} className="p-3 bg-white/80 rounded-full text-indigo-600 hover:bg-white transform hover:scale-110 transition-all"><ShoppingCart size={20} /></button>
                    <button onClick={() => toggleWishlist(product)} className={`p-3 bg-white/80 rounded-full hover:bg-white transform hover:scale-110 transition-all ${isInWishlist(product.id) ? 'text-pink-500' : 'text-gray-600'}`}>
                        <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'product', id: product.id }); }} className="block p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(product.price)}</p>
                    <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold"><Star className="mr-1" size={14} /><span >{product.rating}</span></div>
                </div>
            </a>
        </motion.div>
    );
};

const AuthModal = () => {
    const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);

    const handleLogin = (e) => { e.preventDefault(); login('test@user.com', 'pass'); closeAuthModal(); };
    const handleSignup = (e) => { 
        e.preventDefault(); 
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        signup(name, email, password); 
        closeAuthModal(); 
    };

    return (
        <AnimatePresence>
            {isAuthModalOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative">
                        <button onClick={closeAuthModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X /></button>
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">{isLoginView ? 'Welcome Back!' : 'Create an Account'}</h2>
                            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">{isLoginView ? 'Sign in to continue' : 'Get started with SwiftBasket'}</p>
                            
                            {isLoginView ? (
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="email" placeholder="Email" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="password" placeholder="Password" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105">Sign In</button>
                                </form>
                            ) : (
                                <form onSubmit={handleSignup} className="space-y-4">
                                    <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="text" name="name" placeholder="Full Name" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                                    <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="email" name="email" placeholder="Email" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                                    <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/><input type="password" name="password" placeholder="Password" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"/></div>
                                    <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105">Create Account</button>
                                </form>
                            )}
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                                {isLoginView ? "Don't have an account?" : "Already have an account?"}
                                <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-indigo-600 hover:underline ml-1">{isLoginView ? 'Sign Up' : 'Sign In'}</button>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CompleteProfileModal = () => {
    const { isNewUser, updateUserProfile } = useAuth();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const age = e.target.age.value;
        const sex = e.target.sex.value;
        updateUserProfile({ age, sex });
    };

    return (
        <AnimatePresence>
            {isNewUser && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">Complete Your Profile</h2>
                        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Help us personalize your experience.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="number" name="age" placeholder="Age" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                            <select name="sex" required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105">Save Profile</button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


const Footer = () => (
    <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div><h3 className="text-xl font-bold mb-4">SwiftBasket</h3><p className="text-gray-400">Your one-stop shop for everything you need. Quality products, unbeatable prices.</p></div>
                <div><h4 className="font-semibold mb-4">Shop</h4><ul className="space-y-2 text-gray-400"><li><a href="#" className="hover:text-white">Electronics</a></li><li><a href="#" className="hover:text-white">Fashion</a></li><li><a href="#" className="hover:text-white">Home Goods</a></li></ul></div>
                <div><h4 className="font-semibold mb-4">Support</h4><ul className="space-y-2 text-gray-400"><li><a href="#" className="hover:text-white">Contact Us</a></li><li><a href="#" className="hover:text-white">FAQ</a></li><li><a href="#" className="hover:text-white">Shipping</a></li></ul></div>
                <div><h4 className="font-semibold mb-4">Stay Connected</h4><p className="text-gray-400 mb-2">Subscribe to our newsletter for the latest deals.</p><div className="flex"><input type="email" placeholder="Your email" className="w-full rounded-l-lg p-2 text-gray-800 focus:outline-none"/><button className="bg-indigo-600 p-2 rounded-r-lg">Go</button></div></div>
            </div>
            <div className="text-center text-gray-500 mt-8 border-t border-gray-700 pt-6">© 2025 SwiftBasket. All Rights Reserved.</div>
        </div>
    </footer>
);

const OrderSuccessModal = ({ setView }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md text-center p-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}>
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-4 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
            <button onClick={() => setView({ page: 'home' })} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105">Continue Shopping</button>
        </motion.div>
    </motion.div>
);


// --- PAGES ---

const HomePage = ({ setView, searchQuery, setSearchQuery }) => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [marketplaceFilter, setMarketplaceFilter] = useState('New');
    const productSectionRef = useRef(null);

    useEffect(() => { mockApi.getProducts().then(setProducts); }, []);

    const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
    
    const filteredProducts = useMemo(() => {
        return products
            .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
            .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [products, selectedCategory, searchQuery]);

    const handleExploreClick = () => {
        productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <motion.main {...pageVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 mb-12 text-center text-white shadow-2xl relative overflow-hidden">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-6xl font-extrabold mb-4">Find Your Next Favorite Thing</motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">Explore our curated collection of high-quality products, from cutting-edge tech to timeless fashion.</motion.p>
                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} onClick={handleExploreClick} className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-transform hover:scale-105 shadow-lg">Explore Collection</motion.button>
            </div>
            
            <section ref={productSectionRef} className="scroll-mt-20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Our Products</h2>
                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-full p-1">
                        {['New', 'Resale', 'Swap'].map(filter => (
                            <button key={filter} onClick={() => setMarketplaceFilter(filter)} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${marketplaceFilter === filter ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}>{filter}</button>
                        ))}
                    </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map(category => (
                        <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 font-semibold rounded-full transition-colors ${selectedCategory === category ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-gray-600'}`}>
                            {category}
                        </button>
                    ))}
                </div>

                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(p => <ProductCard key={p.id} product={p} setView={setView} />)}
                </motion.div>
            </section>
        </motion.main>
    );
};

const ProductDetailPage = ({ productId, setView }) => {
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [pincode, setPincode] = useState('');
    const [deliveryInfo, setDeliveryInfo] = useState(null);
    const [isCheckingPincode, setIsCheckingPincode] = useState(false);
    const [priceLockFee] = useState(50);
    const [isPriceLocked, setIsPriceLocked] = useState(false);

    useEffect(() => { mockApi.getProductById(productId).then(setProduct); }, [productId]);

    const handlePincodeCheck = async () => {
        if (pincode.length !== 6) {
            setDeliveryInfo({ available: false, message: 'Please enter a valid 6-digit pincode.' });
            return;
        }
        setIsCheckingPincode(true);
        setDeliveryInfo(null);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            if (data[0].Status === 'Success') {
                const location = data[0].PostOffice[0];
                setDeliveryInfo({
                    available: true,
                    message: `Delivery available to ${location.Name}, ${location.District}. Estimated delivery in 5-7 days.`
                });
            } else {
                setDeliveryInfo({ available: false, message: 'Sorry, delivery is not available to this pincode.' });
            }
        } catch (error) {
            setDeliveryInfo({ available: false, message: 'Could not verify pincode. Please try again.' });
        }
        setIsCheckingPincode(false);
    };

    if (!product) return <div className="text-center py-20">Loading...</div>;

    return (
        <motion.div {...pageVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <img src={product.images[0]} alt={product.name} className="w-full rounded-2xl shadow-xl"/>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                    <div className="flex items-center mb-4"><div className="flex items-center">{[...Array(5)].map((_, i) => (<Star key={i} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} size={20} />))}</div><span className="text-gray-600 dark:text-gray-400 ml-2">{product.rating} ({product.reviews.length} reviews)</span></div>
                    <p className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">{formatCurrency(product.price)}</p>
                    <div className="bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 p-3 rounded-lg mb-4 text-sm font-semibold flex items-center"><Zap size={16} className="mr-2" /> Smart Buy Indicator: Now is the best time to buy!</div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">{product.description}</p>
                    <p className={`font-semibold mb-6 ${product.availability === 'In Stock' ? 'text-green-600' : 'text-red-600'}`}>{product.availability}</p>
                    
                    <div className="border-t border-b dark:border-gray-700 py-4 mb-6">
                        <div className="flex items-center">
                            <MapPin className="text-gray-500 dark:text-gray-400 mr-2" />
                            <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength="6" placeholder="Enter Pincode" className="flex-grow bg-transparent focus:outline-none" />
                            <button onClick={handlePincodeCheck} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50" disabled={isCheckingPincode}>
                                {isCheckingPincode ? 'Checking...' : 'Check'}
                            </button>
                        </div>
                        {deliveryInfo && <div className={`mt-2 text-sm ${deliveryInfo.available ? 'text-green-600' : 'text-red-500'}`}>{deliveryInfo.message}</div>}
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={() => addToCart(product)} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"><ShoppingCart size={20} className="mr-2" /> Add to Cart</button>
                        <button onClick={() => toggleWishlist(product)} className={`p-4 rounded-xl transition-all transform hover:scale-105 ${isInWishlist(product.id) ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-500' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                            <Heart size={24} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                    <div className="mt-4">
                        <button onClick={() => setIsPriceLocked(true)} disabled={isPriceLocked} className="w-full flex items-center justify-center p-3 border-2 border-dashed border-indigo-400 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <Lock size={16} className="mr-2" /> {isPriceLocked ? 'Price Locked for 48 Hours!' : `Lock price for ${formatCurrency(priceLockFee)} (Refundable)`}
                        </button>
                    </div>
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold dark:text-white mb-4">Customer Reviews</h3>
                        <div className="space-y-6">
                            {product.reviews.map((review, index) => (
                                <div key={index} className="border-t dark:border-gray-700 pt-4">
                                    <div className="flex items-center mb-1">
                                        <div className="flex items-center">{[...Array(5)].map((_, i) => (<Star key={i} size={16} className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />))}</div>
                                        <p className="font-bold ml-3">{review.user}</p>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const CartPage = ({ setView }) => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    if (cart.length === 0) return (<motion.div {...pageVariants} className="container mx-auto text-center py-20"><h1 className="text-2xl font-bold dark:text-white mb-4">Your cart is empty</h1><button onClick={() => setView({ page: 'home' })} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700">Continue Shopping</button></motion.div>);
    return (
        <motion.div {...pageVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold dark:text-white mb-6">Your Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence>
                        {cart.map(item => (
                            <motion.div key={item.product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                                <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
                                <div className="flex-grow"><h2 className="font-semibold dark:text-white">{item.product.name}</h2><p className="text-gray-600 dark:text-gray-400">{formatCurrency(item.product.price)}</p></div>
                                <div className="flex items-center"><input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))} className="w-16 text-center border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md mx-4" min="1" /></div>
                                <p className="font-semibold w-24 text-right dark:text-white">{formatCurrency(item.product.price * item.quantity)}</p>
                                <button onClick={() => removeFromCart(item.product.id)} className="ml-4 text-gray-500 hover:text-red-600 dark:hover:text-red-400"><Trash2 size={20} /></button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-28">
                        <h2 className="text-xl font-bold dark:text-white mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
                        <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300"><span>Shipping</span><span>Free</span></div>
                        <hr className="my-4 border-gray-200 dark:border-gray-700" />
                        <div className="flex justify-between font-bold text-lg dark:text-white"><span>Total</span><span>{formatCurrency(cartTotal)}</span></div>
                        <button onClick={() => setView({ page: 'checkout' })} className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const WishlistPage = ({ setView }) => {
    const { wishlist } = useWishlist();
    if (wishlist.length === 0) return (<motion.div {...pageVariants} className="container mx-auto text-center py-20"><h1 className="text-2xl font-bold dark:text-white mb-4">Your wishlist is empty</h1><p className="text-gray-600 dark:text-gray-400 mb-6">Add items you love to your wishlist to save them for later.</p><button onClick={() => setView({ page: 'home' })} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700">Explore Products</button></motion.div>);
    
    return (
        <motion.main {...pageVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold dark:text-white mb-6">Your Wishlist</h1>
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {wishlist.map(p => <ProductCard key={p.id} product={p} setView={setView} />)}
            </motion.div>
        </motion.main>
    );
};

const AccountPage = ({ setView }) => {
    const { user, orderHistory } = useAuth();
    if (!user) return <div className="text-center py-20">Please log in to view your account.</div>;

    return (
        <motion.main {...pageVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold dark:text-white mb-6">My Account</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold dark:text-white mb-4">Profile</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                                <span className="font-semibold text-gray-600 dark:text-gray-400">Name:</span>
                                <span className="font-medium dark:text-white">{user.name}</span>
                            </div>
                            <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                                <span className="font-semibold text-gray-600 dark:text-gray-400">Email:</span>
                                <span className="font-medium dark:text-white">{user.email}</span>
                            </div>
                            <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                                <span className="font-semibold text-gray-600 dark:text-gray-400">Age:</span>
                                <span className="font-medium dark:text-white">{user.age || 'Not set'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-gray-600 dark:text-gray-400">Gender:</span>
                                <span className="font-medium dark:text-white">{user.sex || 'Not set'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold dark:text-white mb-4">Order History</h3>
                        <div className="space-y-4">
                            {orderHistory.length > 0 ? orderHistory.map(order => (
                                <div key={order.id} className="border-b dark:border-gray-700 pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <p className="font-bold">{order.id}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.date}</p>
                                        </div>
                                        <p className="font-bold">{formatCurrency(order.total)}</p>
                                    </div>
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex items-center justify-between mt-2">
                                            <div className="flex items-center">
                                                <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-md mr-4" />
                                                <span>{item.name}</span>
                                            </div>
                                            <button onClick={() => setView({ page: 'resell', item: item })} className="text-sm font-semibold text-indigo-600 hover:underline">Resell / Swap</button>
                                        </div>
                                    ))}
                                </div>
                            )) : <p className="text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </motion.main>
    );
};

const ResellPage = ({ setView, item }) => {
    const [listingType, setListingType] = useState('resell');
    const [price, setPrice] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isListed, setIsListed] = useState(false);

    const handleListSubmit = (e) => {
        e.preventDefault();
        setIsChecking(true);
        setTimeout(() => {
            setIsChecking(false);
            setIsListed(true);
        }, 2500); // Simulate AI check
    };

    if (!item) return <div className="text-center py-20">No item selected.</div>;

    return (
        <motion.main {...pageVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold dark:text-white mb-6">List Your Item</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-2xl mx-auto">
                <div className="flex items-center mb-6">
                    <img src={item.images[0]} alt={item.name} className="w-24 h-24 rounded-lg mr-4" />
                    <div>
                        <h2 className="text-xl font-bold dark:text-white">{item.name}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{item.category}</p>
                    </div>
                </div>

                {isListed ? (
                     <div className="text-center p-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold dark:text-white">Item Listed Successfully!</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Your item is now available on our marketplace.</p>
                        <button onClick={() => setView({ page: 'home' })} className="mt-6 bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700">Back to Shop</button>
                    </div>
                ) : (
                    <form onSubmit={handleListSubmit}>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Upload Photos</label>
                            <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2">Listing Type</label>
                            <div className="flex border border-gray-300 dark:border-gray-600 rounded-full p-1 w-min">
                                <button type="button" onClick={() => setListingType('resell')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${listingType === 'resell' ? 'bg-indigo-600 text-white' : ''}`}>Resell</button>
                                <button type="button" onClick={() => setListingType('swap')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${listingType === 'swap' ? 'bg-indigo-600 text-white' : ''}`}>Swap</button>
                            </div>
                        </div>
                        {listingType === 'resell' && (
                             <div className="mb-4">
                                <label className="block font-semibold mb-2">Set Your Price (₹)</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 2500" className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg p-2" required/>
                            </div>
                        )}
                        {listingType === 'swap' && (
                             <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                                <p>By choosing swap, you'll receive platform credits upon successful exchange. These credits can be used for other purchases.</p>
                            </div>
                        )}
                        <button type="submit" disabled={isChecking} className="w-full mt-6 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 rounded-lg hover:opacity-90 flex items-center justify-center disabled:opacity-50">
                            {isChecking ? <><Loader className="animate-spin mr-2"/> AI Quality Check...</> : 'List Item Now'}
                        </button>
                    </form>
                )}
            </div>
        </motion.main>
    );
};

const CheckoutPage = ({ setView }) => {
    const { cartTotal, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const paymentOptions = [
        { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
        { id: 'upi', name: 'UPI', icon: Smartphone },
        { id: 'cod', name: 'Cash on Delivery', icon: Truck },
    ];
    
    const upiQrCodeUrl = useMemo(() => {
        const upiString = `upi://pay?pa=swiftbasket@okhdfcbank&pn=SwiftBasket&am=${cartTotal}.00&cu=INR&tn=OrderPayment`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    }, [cartTotal]);

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setIsPlacingOrder(true);
        setTimeout(() => {
            setIsPlacingOrder(false);
            setOrderSuccess(true);
            clearCart();
        }, 2000);
    };

    if(orderSuccess) {
        return <OrderSuccessModal setView={setView} />;
    }

    return (
        <motion.div {...pageVariants} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold dark:text-white mb-6">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold dark:text-white mb-4">1. Shipping Information</h2>
                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" placeholder="Full Name" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <input type="text" placeholder="Phone Number" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <input type="text" placeholder="Address" className="sm:col-span-2 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <input type="text" placeholder="City" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        <input type="text" placeholder="Pincode" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </form>

                    <h2 className="text-xl font-bold dark:text-white mt-8 mb-4">2. Payment Method</h2>
                    <div className="space-y-4">
                        {paymentOptions.map(option => (
                            <div key={option.id} onClick={() => setPaymentMethod(option.id)} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === option.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50' : 'border-gray-300 dark:border-gray-600'}`}>
                                <option.icon className="w-6 h-6 mr-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="font-semibold dark:text-white">{option.name}</span>
                            </div>
                        ))}
                    </div>
                    <AnimatePresence mode="wait">
                    <motion.div key={paymentMethod} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="mt-4">
                        {paymentMethod === 'card' && (
                            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <input type="text" placeholder="Card Number" className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                <input type="text" placeholder="Name on Card" className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                <div className="flex gap-4">
                                    <input type="text" placeholder="Expiry (MM/YY)" className="w-1/2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    <input type="text" placeholder="CVV" className="w-1/2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>
                        )}
                        {paymentMethod === 'upi' && (
                             <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                                <p className="dark:text-gray-300">Scan QR or enter UPI ID</p>
                                <img src={upiQrCodeUrl} alt="UPI QR Code" className="mx-auto rounded-lg"/>
                                <input type="text" placeholder="yourname@bank" className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        )}
                        {paymentMethod === 'cod' && (
                             <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="dark:text-gray-300">You can pay in cash to the delivery agent upon receiving your order.</p>
                             </div>
                        )}
                    </motion.div>
                    </AnimatePresence>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-28">
                        <h2 className="text-xl font-bold dark:text-white mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>{formatCurrency(cartTotal)}</span></div>
                        <div className="flex justify-between mb-2 text-gray-600 dark:text-gray-300"><span>Shipping</span><span>Free</span></div>
                        <hr className="my-4 border-gray-200 dark:border-gray-700" />
                        <div className="flex justify-between font-bold text-lg dark:text-white"><span>Total</span><span>{formatCurrency(cartTotal)}</span></div>
                        <button onClick={handlePlaceOrder} disabled={isPlacingOrder} className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                            {isPlacingOrder ? <Loader className="animate-spin" /> : `Pay ${formatCurrency(cartTotal)}`}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- App ---
export default function App() {
    const [view, setView] = useState({ page: 'home' });
    const [searchQuery, setSearchQuery] = useState('');

    const renderView = () => {
        switch (view.page) {
            case 'home': return <HomePage setView={setView} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
            case 'product': return <ProductDetailPage productId={view.id} setView={setView} />;
            case 'cart': return <CartPage setView={setView} />;
            case 'checkout': return <CheckoutPage setView={setView} />;
            case 'wishlist': return <WishlistPage setView={setView} />;
            case 'account': return <AccountPage setView={setView} />;
            case 'resell': return <ResellPage setView={setView} item={view.item} />;
            default: return <HomePage setView={setView} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
        }
    };
    return (
        <ThemeProvider>
            <AuthProvider>
                <WishlistProvider>
                    <CartProvider>
                        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200 transition-colors">
                            <Header setView={setView} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                            <AuthModal />
                            <CompleteProfileModal />
                            <AnimatePresence mode="wait">
                                <motion.div key={view.page + (view.id || '')}>
                                    {renderView()}
                                </motion.div>
                            </AnimatePresence>
                            <Footer />
                        </div>
                    </CartProvider>
                </WishlistProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
