/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  ShieldCheck, 
  Wind, 
  Thermometer, 
  ClipboardCheck, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle2,
  Menu,
  X,
  LogIn,
  User
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, type User as FirebaseUser } from 'firebase/auth';
import { getFirebase, handleFirestoreError } from './lib/firebase';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<null | 'success' | 'error' | 'loading'>(null);
  const [complaintStatus, setComplaintStatus] = useState<null | 'success' | 'error' | 'loading'>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const roomCharges = [
    { type: 'AC Room', price: 20000, icon: <Wind className="w-8 h-8 text-hostel-gold" />, features: ['Modern AC', 'Premium Bedding', 'Spacious Wardrobe'] },
    { type: 'Non-AC Room', price: 15000, icon: <Thermometer className="w-8 h-8 text-hostel-gold" />, features: ['Wall Fan', 'Comfortable Bedding', 'Standard Wardrobe'] },
  ];

  const facilities = [
    { title: 'High-Speed Wi-Fi', icon: <Wifi className="w-6 h-6" />, desc: 'Unlimited high-speed internet connectivity throughout the premises.' },
    { title: '24/7 Security', icon: <ShieldCheck className="w-6 h-6" />, desc: 'Round-the-clock security guards and CCTV monitoring for your safety.' },
  ];

  const handleLogin = async () => {
    try {
      const { auth } = await getFirebase();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setRegistrationStatus('loading');
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    try {
      const { db } = await getFirebase();
      await addDoc(collection(db, 'registrations'), {
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        roomType: formData.get('roomType'),
        createdAt: serverTimestamp(),
      });
      setRegistrationStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationStatus('error');
    } finally {
      setTimeout(() => setRegistrationStatus(null), 5000);
    }
  };

  const handleComplaint = async (e: FormEvent) => {
    e.preventDefault();
    setComplaintStatus('loading');
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    try {
      const { db, auth } = await getFirebase();
      if (!auth.currentUser) {
        throw new Error('Please sign in to submit a complaint');
      }

      await addDoc(collection(db, 'complaints'), {
        roomNumber: formData.get('roomNumber'),
        category: formData.get('category'),
        details: formData.get('details'),
        status: 'pending',
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setComplaintStatus('success');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Complaint failed:', error);
      setComplaintStatus('error');
    } finally {
      setTimeout(() => setComplaintStatus(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-art-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto border-[12px] border-art-accent bg-art-bg min-h-screen relative overflow-hidden">
        {/* Navigation */}
        <nav className="sticky top-0 w-full z-50 bg-art-bg/80 backdrop-blur-md border-b border-art-accent/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex justify-between items-center h-24">
              <div className="flex flex-col">
                <span className="text-3xl font-serif font-black tracking-tighter leading-none text-art-ink uppercase">MNC<br/>Girls Hostel</span>
                <span className="art-label-caps mt-1">Premium Living</span>
              </div>
              
              <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[2px] text-art-muted">
                <a href="#about" className="hover:text-art-accent transition-colors">About</a>
                <a href="#charges" className="hover:text-art-accent transition-colors">Rooms</a>
                <a href="#facilities" className="hover:text-art-accent transition-colors">Facilities</a>
                <a href="#register" className="hover:text-art-accent transition-colors underline underline-offset-8 decoration-art-accent/30 hover:decoration-art-accent">Admission</a>
                <a href="#complaints" className="hover:text-art-accent transition-colors">Complaints</a>
                
                {user ? (
                  <div className="flex items-center gap-2 text-art-ink bg-art-accent/10 px-3 py-1 rounded-full">
                    <User className="w-3 h-3" />
                    <span className="text-[9px] font-black">{user.displayName}</span>
                  </div>
                ) : (
                  <button onClick={handleLogin} className="flex items-center gap-2 text-art-ink hover:text-art-accent transition-colors">
                    <LogIn className="w-4 h-4 text-art-accent" />
                    <span>Login</span>
                  </button>
                )}
              </div>

            <button 
              className="md:hidden p-2 text-hostel-ink"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-hostel-cream border-b border-hostel-gold/10 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4 text-center">
                <a href="#about" onClick={() => setIsMenuOpen(false)} className="block text-lg font-serif">About</a>
                <a href="#charges" onClick={() => setIsMenuOpen(false)} className="block text-lg font-serif">Rooms</a>
                <a href="#facilities" onClick={() => setIsMenuOpen(false)} className="block text-lg font-serif">Facilities</a>
                <a href="#register" onClick={() => setIsMenuOpen(false)} className="block text-lg font-serif">Admission</a>
                <a href="#complaints" onClick={() => setIsMenuOpen(false)} className="block text-lg font-serif">Complaints</a>
                {!user && (
                  <button onClick={handleLogin} className="w-full flex items-center justify-center gap-2 py-2 border border-hostel-ink rounded-lg font-medium">
                    <LogIn className="w-4 h-4" />
                    <span>Resident Login</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-20 overflow-hidden border-b border-art-accent/10">
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-end gap-12 text-left justify-between">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-3/5"
            >
              <span className="art-label-caps block mb-6">Premium Living & Secure Environment</span>
              <h1 className="text-[12vw] lg:text-[120px] font-serif font-black leading-[0.85] tracking-[-3px] text-art-ink mb-12">
                Comfort<br/>meets<br/><span className="text-art-accent">Safety</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-6 mt-16">
                <a href="#register" className="bg-art-accent text-white px-10 py-5 font-bold uppercase tracking-[3px] text-xs hover:brightness-95 transition-all art-card-shadow block text-center">
                  Request Booking
                </a>
                <a href="#charges" className="border border-art-accent px-10 py-5 font-bold uppercase tracking-[3px] text-xs transition-all text-art-ink block text-center hover:bg-art-accent/5">
                  View Rates
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="lg:w-2/5 relative"
            >
              <div className="aspect-[4/5] overflow-hidden art-card-shadow border border-art-border bg-white p-4">
                <img 
                  src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop" 
                  alt="Hostel Room" 
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute top-10 -left-10 bg-art-ink text-white p-6 art-card-shadow max-w-[200px] border border-white/10">
                <div className="flex items-center gap-2 text-art-accent mb-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="art-label-caps text-art-accent">Safe Haven</span>
                </div>
                <p className="text-[10px] opacity-60 leading-relaxed font-medium uppercase tracking-widest leading-loose">24/7 Professional Security & Integrated CCTV Monitoring</p>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Charges Section */}
      <section id="charges" className="py-32 border-b border-art-accent/10">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col lg:flex-row gap-16 items-baseline mb-24">
            <h2 className="text-[120px] font-serif font-black text-art-accent opacity-20 -mb-16 -ml-4 leading-none">01</h2>
            <div className="flex-1">
              <h2 className="text-5xl font-serif font-black mb-6 italic tracking-tighter">Plan your stay</h2>
              <p className="art-label-caps">Select between our luxury and standard suites</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
            {roomCharges.map((room, idx) => (
              <motion.div
                key={room.type}
                whileHover={{ y: -10 }}
                className="p-12 bg-white border border-art-border art-card-shadow transition-all relative overflow-hidden group"
              >
                <div className="mb-10 text-art-accent group-hover:scale-110 transition-transform origin-left">{room.icon}</div>
                <span className="art-label-caps block mb-2">Option 0{idx + 1}</span>
                <h3 className="text-3xl font-serif font-black mb-4 uppercase tracking-tighter">{room.type}</h3>
                <div className="text-5xl font-serif font-black text-art-ink mb-10 flex items-baseline">
                  <span className="text-lg font-sans mr-2">Rs.</span>{room.price.toLocaleString()}
                  <span className="text-xs font-bold tracking-widest uppercase ml-3 opacity-40">/ month</span>
                </div>
                <ul className="space-y-4 mb-10 border-t border-art-border pt-10">
                  {room.features.map(feature => (
                    <li key={feature} className="flex items-center gap-3 text-xs font-bold uppercase tracking-[2px] text-art-muted">
                      <div className="w-1.5 h-1.5 bg-art-accent rounded-full" /> {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-32 bg-art-ink text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            <div className="lg:w-1/2">
              <h2 className="text-[120px] font-serif font-black text-art-accent opacity-10 absolute -top-16 -left-4 leading-none">02</h2>
              <h2 className="text-5xl font-serif font-black mb-10 italic leading-tight text-white tracking-tighter">Art of Excellence</h2>
              <p className="text-white/40 mb-16 max-w-md leading-relaxed uppercase tracking-widest text-xs font-bold">
                A sanctuary designed for your focus and peace. Our facilities merge modern efficiency with artistic comfort.
              </p>
              <div className="grid gap-10">
                {facilities.map((facility, idx) => (
                  <div key={facility.title} className="flex items-start gap-10 group">
                    <div className="w-16 h-16 border-2 border-art-accent flex items-center justify-center text-art-accent text-xl font-serif group-hover:bg-art-accent group-hover:text-art-ink transition-all duration-500 font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-serif font-black mb-2 uppercase tracking-tighter text-art-accent">{facility.title}</h4>
                      <p className="text-xs text-white/40 font-bold tracking-[2px] uppercase">{facility.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 border-[20px] border-white/5 art-card-shadow bg-white p-6 self-center">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop" 
                  alt="Common Area" 
                  className="w-full h-full object-cover grayscale brightness-50"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
          <h1 className="text-[400px] font-serif font-black -mb-32 pr-10">MNC</h1>
        </div>
      </section>

      {/* Admission Form Section */}
      <section id="register" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/2">
               <h2 className="text-[120px] font-serif font-black text-art-accent opacity-20 -mb-16 -ml-4 leading-none">03</h2>
               <h2 className="text-5xl font-serif font-black mb-10 italic uppercase tracking-tighter">Registration</h2>
               <p className="art-label-caps mb-12">Submit your request for a verified booking</p>
               <div className="p-10 border border-art-accent art-card-shadow bg-art-bg/30">
                 <p className="serif italic text-2xl text-art-muted leading-relaxed">
                   "We provide more than just a room; we provide a community where you can thrive and grow."
                 </p>
                 <div className="h-px w-20 bg-art-accent mt-8"></div>
               </div>
            </div>
            
            <div className="lg:w-1/2">
              <form id="admissionForm" onSubmit={handleRegister} className="bg-white p-12 border border-art-border art-card-shadow space-y-10">
                <div className="grid sm:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="art-label-caps">Full Name</label>
                    <input required name="fullName" type="text" className="art-input-field" placeholder="Name" />
                  </div>
                  <div className="space-y-4">
                    <label className="art-label-caps">Phone Number</label>
                    <input required name="phone" type="tel" className="art-input-field" placeholder="+92 --- --- ---" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="art-label-caps">Email Address</label>
                  <input required name="email" type="email" className="art-input-field" placeholder="email@address.com" />
                </div>
                <div className="space-y-4">
                  <label className="art-label-caps">Preferred Room</label>
                  <select name="roomType" className="art-input-field cursor-pointer">
                    <option>AC Room - RS:- 20,000</option>
                    <option>Non-AC Room - RS:- 15,000</option>
                  </select>
                </div>
                <button 
                  disabled={registrationStatus === 'loading'}
                  className="w-full bg-art-accent text-white py-6 font-bold uppercase tracking-[4px] text-xs transition-all hover:brightness-105 disabled:opacity-50"
                >
                  {registrationStatus === 'loading' ? 'Processing...' : 'Request Booking'}
                </button>
                {registrationStatus === 'success' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 font-bold uppercase tracking-widest text-[10px] text-center">
                    Registration Logged Successfuly
                  </motion.p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Complaint Section */}
      <section id="complaints" className="py-32 bg-[#F1EDE4]">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 border-b border-art-accent pb-6">
            <h2 className="text-5xl font-serif font-black italic uppercase tracking-tighter">Support Desk</h2>
            <span className="art-label-caps text-art-accent italic tracking-normal">Direct Assistance within 24 Hours</span>
          </div>
          
          <form id="complaintForm" onSubmit={handleComplaint} className="bg-white p-12 border border-art-border art-card-shadow space-y-10">
            {!user && (
              <div className="bg-art-accent/10 p-10 border border-art-accent/20 text-center mb-8">
                <p className="art-label-caps mb-6">Resident credentials required</p>
                <button 
                  type="button"
                  onClick={handleLogin}
                  className="bg-art-ink text-white px-10 py-4 font-bold uppercase tracking-[3px] text-[10px] hover:bg-art-accent transition-all"
                >
                  Authorize Identity
                </button>
              </div>
            )}
            
            <div className={!user ? 'opacity-30 pointer-events-none grayscale' : ''}>
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="space-y-4">
                  <label className="art-label-caps">Room Identification</label>
                  <input required name="roomNumber" type="text" className="art-input-field" placeholder="Number" />
                </div>
                <div className="space-y-4">
                  <label className="art-label-caps">Category</label>
                  <select name="category" className="art-input-field cursor-pointer">
                    <option>Connectivity / Wi-Fi</option>
                    <option>Utility Failure</option>
                    <option>Structural / Maintenance</option>
                    <option>Security Observation</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="art-label-caps">Issue Specification</label>
                  <input required name="details" type="text" className="art-input-field" placeholder="Description" />
                </div>
              </div>
              <div className="mt-12 flex justify-end">
                <button 
                  disabled={complaintStatus === 'loading' || !user}
                  className="bg-art-ink text-white px-16 py-5 font-bold uppercase tracking-[4px] text-xs hover:bg-art-accent transition-all disabled:opacity-50"
                >
                  {complaintStatus === 'loading' ? 'Submitting...' : 'Dispatch Support'}
                </button>
              </div>
            </div>
            {complaintStatus === 'success' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 font-bold uppercase tracking-widest text-[10px] text-right">
                Log Dispatched Successfully
              </motion.p>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-art-accent text-white py-32 px-10 border-t-[12px] border-art-ink">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-24">
            <div className="space-y-10">
              <div className="flex flex-col">
                <span className="text-5xl font-serif font-black tracking-tighter leading-none text-art-ink uppercase">MNC<br/>Girls Hostel</span>
                <span className="art-label-caps mt-4 text-white">The standard of excellence</span>
              </div>
              <p className="art-label-caps text-white/60 italic lowercase tracking-normal font-medium leading-relaxed">
                empowering women through safe and quality living spaces since 2010. our vision is integrated safety.
              </p>
            </div>
            
            <div className="space-y-12">
              <h4 className="art-label-caps text-art-ink">Information Desk</h4>
              <div className="space-y-8 font-serif italic text-2xl text-art-ink">
                <div className="leading-tight">0315-0348163<br/>0314-7710101</div>
                <div>mncgirlshostel@yahoo.com</div>
                <div className="text-xl leading-snug">MNC Girls Hostel Opposite Alamgir Mart Suchal Colony Larkana</div>
              </div>
            </div>

            <div className="space-y-10">
              <h4 className="art-label-caps text-art-ink">System Updates</h4>
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Register for availability alerts.</p>
              <div className="flex flex-col gap-4">
                <input type="email" placeholder="Email" className="bg-white/10 border-b border-art-ink p-4 text-sm focus:outline-none focus:border-white w-full placeholder:text-white/30" />
                <button className="bg-art-ink text-white py-4 font-bold uppercase tracking-[4px] text-xs hover:bg-black transition-all">
                  Join The Register
                </button>
              </div>
            </div>
          </div>
          <div className="mt-24 pt-10 border-t border-art-ink/20 flex flex-col md:flex-row justify-between items-center gap-6 art-label-caps text-white/40">
            <p>© 2026 MNC Girls Hostel. Architectural Integrity Guaranteed.</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
);
}

