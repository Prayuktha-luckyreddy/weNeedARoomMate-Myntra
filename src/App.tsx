import React, { useState, useEffect } from 'react';
import { initialSellers } from './data/initialSellers';
import { Seller, MentorshipApp } from './types';
import BuyerView, { products } from './components/BuyerView';
import MentorView from './components/MentorView';
import NewSellerView from './components/NewSellerView';
import { 
  Award, 
  Sparkles, 
  ShoppingBag, 
  Users, 
  Building2, 
  Info, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Global Shared States
  const [sellers, setSellers] = useState<Seller[]>(initialSellers);

  // Applications State
  const [applications, setApplications] = useState<MentorshipApp[]>([
    {
      id: 'app-ashas-kunal',
      sellerId: 'ashas-handlooms',
      sellerName: "Asha's Handlooms",
      mentorId: 'kunal-textiles',
      mentorName: "Kunal Textiles",
      category: "Sungudi Cotton Sarees",
      clusterCity: "Secunderabad",
      customNote: "Hi Kunal, we manufacture pure cotton kurtis & sarees in Secunderabad and would love your guidance.",
      timestamp: "10 mins ago",
      status: 'Pending Review'
    }
  ]);
  
  // Track purchase counts to calculate referral commission: { sellerId: purchaseCount }
  const [ordersCount, setOrdersCount] = useState<Record<string, number>>({
    'ashas-handlooms': 0,
    'sravanthi-silks': 0,
    'bihar-handlooms': 0,
    'jaipur-block-prints': 2, // Pre-load 2 purchases for Jaipur Block Prints which is already Vouched
    'rajlaxmi-textiles': 0,
    'kunal-textiles': 4520 // Established Mentor Store (far past 50 orders)
  });

  // Commission state (lives at parent level)
  const [commission, setCommission] = useState(0);

  // Synchronize commission when sellers or ordersCount updates
  // Mentor's referral commission is exactly 2% of the product price for each purchase made during mentorship period (up to 50 orders).
  useEffect(() => {
    const totalCommission = (sellers || []).reduce((sum, s) => {
      if (s?.status === 'Vouched' && s.id !== 'kunal-textiles') {
        const product = products.find(p => p.sellerId === s.id || p.sellerId.toLowerCase() === s.name.toLowerCase());
        const price = product ? product.price : 1000;
        const totalOrders = ordersCount[s.id] || 0;
        const eligibleOrders = Math.min(50, totalOrders);
        return sum + (eligibleOrders * (price * 0.02));
      }
      return sum;
    }, 0);
    setCommission(Math.round(totalCommission * 100) / 100);
  }, [sellers, ordersCount]);

  // Current Screen selection
  const [activeTab, setActiveTab] = useState<'buyer' | 'mentor' | 'seller'>('buyer');
  
  // Info panel state (collapse/expand explanation)
  const [showExplanation, setShowExplanation] = useState(true);

  // Immutable Vouch a new seller callback (supports both ID and Name defensively)
  const handleVouch = (sellerNameOrId: string) => {
    setSellers(prevSellers => {
      if (!Array.isArray(prevSellers)) return [];
      return prevSellers.map(seller => {
        if (
          seller && (
            seller.id === sellerNameOrId || 
            seller.name === sellerNameOrId || 
            seller.name?.trim().toLowerCase() === sellerNameOrId?.trim().toLowerCase() ||
            seller.id?.trim().toLowerCase() === sellerNameOrId?.trim().toLowerCase()
          )
        ) {
          return { ...seller, status: 'Vouched' as const };
        }
        return seller;
      });
    });
  };

  // Handler: New Seller applies for mentorship to a Mentor
  const handleApplyForMentorship = (sellerId: string, mentorId: string, mentorName: string, customNote: string) => {
    const sellerObj = sellers.find(s => s.id === sellerId || s.name.toLowerCase() === sellerId.toLowerCase());
    const sellerName = sellerObj ? sellerObj.name : "Artisan Partner";
    const category = sellerObj ? sellerObj.category : "Handloom";
    const clusterCity = sellerObj ? sellerObj.clusterCity : "Local Cluster";

    setApplications(prev => {
      // Remove any existing application from this seller to this mentor, or replace it
      const filtered = prev.filter(app => !(app.sellerId === sellerId && app.mentorId === mentorId));
      const newApp: MentorshipApp = {
        id: `app-${Date.now()}`,
        sellerId,
        sellerName,
        mentorId,
        mentorName,
        category,
        clusterCity,
        customNote: customNote.trim() || "Interested in cluster mentorship and quality guidelines.",
        timestamp: "Just now",
        status: 'Pending Review'
      };
      return [newApp, ...filtered];
    });
  };

  // Handler: Mentor accepts application and vouches
  const handleAcceptApplication = (applicationId: string, sellerId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return { ...app, status: 'Accepted' as const };
      }
      return app;
    }));
    handleVouch(sellerId);
  };

  // Handler: Mentor declines application
  const handleDeclineApplication = (applicationId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        return { ...app, status: 'Declined' as const };
      }
      return app;
    }));
  };


  // Instant Buy callback
  const handleInstantBuy = (sellerId: string) => {
    setOrdersCount(prev => ({
      ...prev,
      [sellerId]: (prev[sellerId] || 0) + 1
    }));
  };

  // Simulate multiple orders callback (e.g., +10 orders)
  const handleSimulateOrders = (sellerId: string, count: number = 10) => {
    setOrdersCount(prev => ({
      ...prev,
      [sellerId]: (prev[sellerId] || 0) + count
    }));
  };

  // Update description from Weaver Hub callback
  const handleUpdateDescription = (sellerId: string, desc: string, category: string) => {
    setSellers(prev => prev.map(s => {
      if (s.id === sellerId) {
        return { ...s, description: desc, category: category };
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f6] text-[#282c3f] flex flex-col font-sans" id="app-root-container">
      
      {/* Dynamic Hackathon Explanatory Header */}
      <div className="bg-myntra-gradient text-white py-4 px-4 sm:px-6 shadow-md border-b border-white/10 relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 uppercase text-[9px] tracking-widest font-extrabold px-2 py-0.5 rounded-sm border border-white/10 font-mono">
                Myntra Hackathon 2026
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
              <span className="text-[10px] text-emerald-200 font-semibold uppercase tracking-wider">Prototype Mode</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-display tracking-tight mt-1 flex items-center gap-2">
              <span>Borrowed Trust</span>
              <span className="text-sm font-light opacity-90">| Peer Vouching Ecosystem for Bharat Sellers</span>
            </h1>
            <p className="text-xs text-white/85 max-w-3xl mt-1 leading-snug">
              Leveraging the reputation of established tier-1 cluster leads to physically verify & mentor rural craft makers, unlocking organic trust badges and lifting search rank limits.
            </p>
          </div>

          <button 
            onClick={() => setShowExplanation(prev => !prev)}
            className="bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 self-stretch md:self-auto justify-center cursor-pointer"
            id="toggle-explanation-btn"
          >
            <Info className="w-4 h-4" />
            <span>{showExplanation ? "Hide Context" : "How It Works"}</span>
          </button>
        </div>

        {/* Expandable Concept Map Block */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden max-w-6xl mx-auto mt-4"
              id="concept-map-block"
            >
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 text-xs text-white/90 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 bg-black/10 p-3 rounded-xl">
                  <h4 className="font-bold text-amber-200 flex items-center gap-1 font-display">
                    <span className="bg-amber-300 text-neutral-900 w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px] font-bold">1</span>
                    The Micro-Weaver Challenge
                  </h4>
                  <p className="text-white/80 leading-relaxed text-[11px]">
                    Bharat micro-sellers lack transaction histories. Under standard rules, they are restricted in visibility (grey warning badge on search result pages) to protect buyers from potential fulfillment risk.
                  </p>
                </div>

                <div className="space-y-1 bg-black/10 p-3 rounded-xl">
                  <h4 className="font-bold text-amber-200 flex items-center gap-1 font-display">
                    <span className="bg-amber-300 text-neutral-900 w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px] font-bold">2</span>
                    The Vouching Network
                  </h4>
                  <p className="text-white/80 leading-relaxed text-[11px]">
                    An established nearby partner like <strong>Kunal Textiles</strong> physically audits the workshop on key SLAs (fair wages, quality packaging, loom authenticity) and issues a <strong>co-signature trust vouch</strong>.
                  </p>
                </div>

                <div className="space-y-1 bg-black/10 p-3 rounded-xl">
                  <h4 className="font-bold text-amber-200 flex items-center gap-1 font-display">
                    <span className="bg-amber-300 text-neutral-900 w-4 h-4 rounded-full flex items-center justify-center font-mono text-[9px] font-bold">3</span>
                    Unlocked Exponential Growth
                  </h4>
                  <p className="text-white/80 leading-relaxed text-[11px]">
                    Vouched sellers get a sparkling <strong>"Peer-Vouched" badge</strong> on Myntra PDPs, boosting conversions. Mentors earn <strong>₹250 per purchase</strong>, creating a self-scaling mentorship network!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* GLOBAL PERSPECTIVE SWITCHER TABS NAVBAR (TOP STICKY GLASSMORPHISM) */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-200 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-4">
          
          {/* Logo Section from the design HTML */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-myntra-gradient rounded-md flex items-center justify-center text-white font-bold select-none">M</div>
            <span className="font-display font-black text-lg tracking-tighter">HACKATHON <span className="text-myntra-pink">BHARAT</span></span>
          </div>
          
          <div className="flex bg-neutral-100 p-1 rounded-full gap-0.5 border border-neutral-200/50 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('buyer')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'buyer'
                  ? 'bg-white text-myntra-pink shadow-sm ring-1 ring-neutral-200/20'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
              id="global-nav-view-1"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Buyer App</span>
            </button>
            <button
              onClick={() => setActiveTab('mentor')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'mentor'
                  ? 'bg-white text-myntra-pink shadow-sm ring-1 ring-neutral-200/20'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
              id="global-nav-view-2"
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Mentor Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('seller')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'seller'
                  ? 'bg-white text-myntra-pink shadow-sm ring-1 ring-neutral-200/20'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
              id="global-nav-view-3"
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>New Seller Hub</span>
            </button>
          </div>

          {/* Quick Real-Time Info ticker */}
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-neutral-500 bg-neutral-100 rounded-full py-1.5 px-3.5 border border-neutral-200/50 font-mono">
            <TrendingUp className="w-3.5 h-3.5 text-myntra-green animate-pulse" />
            <span>PROTOTYPE SYNC ACTIVE</span>
          </div>

        </div>
      </div>

      {/* CORE VIEWPORT */}
      <main className="flex-1 max-w-6xl w-full mx-auto pb-16 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'buyer' && (
            <motion.div
              key="buyer-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-4 max-w-md mx-auto px-4 mt-2">
                <span className="text-[10px] uppercase tracking-widest text-[#ff3f6c] font-extrabold bg-[#ff3f6c]/10 px-2 py-0.5 rounded-full">
                  Buyer Simulation
                </span>
                <p className="text-xs text-neutral-500 mt-1 leading-snug">
                  Experience how a Myntra customer sees the verified status of Asha's Handlooms in Secunderabad cluster.
                </p>
              </div>
              <BuyerView 
                sellers={sellers} 
                setSellers={setSellers}
                commission={commission}
                setCommission={setCommission}
                onInstantBuy={handleInstantBuy} 
                onSimulateOrders={handleSimulateOrders}
                ordersCount={ordersCount} 
              />
            </motion.div>
          )}

          {activeTab === 'mentor' && (
            <motion.div
              key="mentor-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-2 max-w-lg mx-auto px-4 mt-2">
                <span className="text-[10px] uppercase tracking-widest text-[#f54e18] font-extrabold bg-[#f54e18]/10 px-2 py-0.5 rounded-full">
                  Established Mentor Dashboard
                </span>
                <p className="text-xs text-neutral-500 mt-1 leading-snug">
                  Manage cluster artisans. Physical audit checks let you vouch for them, upgrading their status instantly.
                </p>
              </div>
              <MentorView 
                sellers={sellers} 
                setSellers={setSellers}
                commission={commission}
                setCommission={setCommission}
                onVouch={handleVouch} 
                ordersCount={ordersCount} 
                applications={applications}
                onAcceptApplication={handleAcceptApplication}
                onDeclineApplication={handleDeclineApplication}
              />
            </motion.div>
          )}

          {activeTab === 'seller' && (
            <motion.div
              key="seller-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-2 max-w-lg mx-auto px-4 mt-2">
                <span className="text-[10px] uppercase tracking-widest text-[#282c3f] font-extrabold bg-[#282c3f]/10 px-2 py-0.5 rounded-full">
                  Micro-Weaver Workspace
                </span>
                <p className="text-xs text-neutral-500 mt-1 leading-snug">
                  Cycle through local weavers. Apply to established cluster mentors and track live status.
                </p>
              </div>
              <NewSellerView 
                sellers={sellers} 
                setSellers={setSellers}
                commission={commission}
                setCommission={setCommission}
                onUpdateDescription={handleUpdateDescription} 
                ordersCount={ordersCount}
                onSimulateOrders={handleSimulateOrders}
                applications={applications}
                onApplyForMentorship={handleApplyForMentorship}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="bg-neutral-900 text-neutral-400 py-6 px-4 border-t border-neutral-800 text-center text-xs select-none mt-auto">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-display font-medium text-neutral-300">
            Borrowed Trust Framework — Prepared for Myntra Outliers Hackathon 2026
          </p>
          <p className="text-[10px] text-neutral-500">
            A collaborative system empowering handloom artisans and rural weavers through physical social network underwriting.
          </p>
          <div className="flex justify-center gap-1.5 items-center text-[9px] text-neutral-600 font-mono pt-1">
            <span>PLATFORM VERIFICATION COMPLIANT</span>
            <span>•</span>
            <span>SECURE OFFLINE DESKTOP ENGINES ENABLED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
