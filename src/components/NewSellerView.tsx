import React, { useState, useEffect } from 'react';
import { Seller, MentorshipApp, MentorInfo } from '../types';
import { initialMentors } from '../data/initialMentors';
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  HelpCircle, 
  Lock, 
  Unlock, 
  Sparkles, 
  Send,
  UserCheck,
  AlertTriangle,
  ChevronRight,
  Info,
  Star,
  Users,
  Award,
  Check,
  X,
  XCircle,
  MessageSquareCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewSellerViewProps {
  sellers: Seller[];
  setSellers?: React.Dispatch<React.SetStateAction<Seller[]>>;
  commission?: number;
  setCommission?: React.Dispatch<React.SetStateAction<number>>;
  onUpdateDescription: (sellerId: string, desc: string, category: string) => void;
  ordersCount?: Record<string, number>;
  onSimulateOrders?: (sellerId: string, count?: number) => void;
  applications?: MentorshipApp[];
  onApplyForMentorship?: (sellerId: string, mentorId: string, mentorName: string, customNote: string) => void;
}

export default function NewSellerView({ 
  sellers, 
  setSellers, 
  commission, 
  setCommission, 
  onUpdateDescription, 
  ordersCount, 
  onSimulateOrders,
  applications = [],
  onApplyForMentorship
}: NewSellerViewProps) {
  // We can switch views between 3 small sellers: Asha, Sravanthi, Bihar
  const targetSellerIds = ['ashas-handlooms', 'sravanthi-silks', 'bihar-handlooms'];
  const [activeSellerId, setActiveSellerId] = useState<string>('ashas-handlooms');
  
  // Find currently active seller
  const currentSeller = (sellers || []).find(s => s?.id === activeSellerId || s?.name?.toLowerCase() === activeSellerId?.toLowerCase()) || sellers?.[0] || {
    id: activeSellerId,
    name: "Artisan Partner",
    clusterCity: "Local Cluster",
    category: "Handloom",
    status: "Pending" as const,
    description: "Traditional Master weavers from local Bharat clusters.",
    whatsappNumber: "+91 99999"
  };

  // Local form state
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [permitContact, setPermitContact] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Application Modal state
  const [selectedMentorForModal, setSelectedMentorForModal] = useState<MentorInfo | null>(null);
  const [modalCustomNote, setModalCustomNote] = useState('');
  const [applicationSentToast, setApplicationSentToast] = useState<string | null>(null);

  // Sync form inputs when switching active seller
  useEffect(() => {
    if (currentSeller) {
      setFormDesc(currentSeller.description);
      setFormCategory(currentSeller.category);
      setFormSubmitted(false);
    }
  }, [activeSellerId, currentSeller]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDescription(currentSeller.id, formDesc, formCategory);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
    }, 4000);
  };

  const isVouched = currentSeller.status === 'Vouched';
  const sellerOrders = ordersCount?.[currentSeller.id] !== undefined ? ordersCount[currentSeller.id] : (currentSeller.id === 'kunal-textiles' ? 4520 : 0);
  const isIndependent = isVouched && sellerOrders >= 50;
  
  // Active application for current seller
  const currentApp = applications.find(a => a.sellerId === currentSeller.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6" id="new-seller-view-container">
      {/* Sub-Navigation for switching perspectives */}
      <div className="bg-neutral-200/60 border border-neutral-200 p-1.5 rounded-2xl flex flex-wrap gap-1.5 justify-between items-center mb-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-3 py-1">
          Simulate Perspective:
        </span>
        <div className="flex flex-wrap gap-1">
          {targetSellerIds.map((id) => {
            const sellerObj = (sellers || []).find(s => s?.id === id || s?.name?.toLowerCase() === id?.toLowerCase());
            if (!sellerObj) return null;
            const sellerIsVouched = sellerObj?.status === 'Vouched';

            return (
              <button
                key={id}
                onClick={() => setActiveSellerId(id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeSellerId === id
                    ? 'bg-myntra-pink text-white shadow-xs'
                    : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-150'
                }`}
                id={`simulate-seller-btn-${id}`}
              >
                <span>{sellerObj.name.split("'")[0]}</span>
                {sellerIsVouched ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 border border-white shrink-0"></span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-400 border border-white shrink-0"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Dashboard Header & Verification Status Tracker */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shop Header card */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm relative overflow-hidden">
            {/* Handloom-themed design header background bar */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-myntra-pink via-myntra-orange to-amber-400"></div>

            <div className="flex justify-between items-start mt-1">
              <div>
                <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                  Weaver Dashboard
                </span>
                <h2 className="text-xl font-bold text-neutral-800 font-display mt-2">{currentSeller.name}</h2>
                <p className="text-xs text-neutral-500 mt-1">Local Craft: <strong>{currentSeller.category}</strong></p>
                <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                  📍 Origin Cluster: {currentSeller.clusterCity}, India
                </p>
              </div>

              {/* Status Ribbon Pill */}
              {isIndependent ? (
                <div className="bg-emerald-100 border border-emerald-300 rounded-xl px-3 py-2 flex flex-col items-end select-none shadow-2xs">
                  <div className="flex items-center gap-1 text-emerald-950 font-bold text-xs">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>⭐ Established Seller</span>
                  </div>
                  <span className="text-[9px] text-emerald-700 font-semibold mt-0.5 font-mono">50+ Orders Achieved</span>
                </div>
              ) : isVouched ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 flex flex-col items-end select-none">
                  <div className="flex items-center gap-1 text-emerald-800 font-bold text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Peer-Vouched</span>
                  </div>
                  <span className="text-[9px] text-emerald-600 font-medium mt-0.5 font-mono">Myntra Verified</span>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex flex-col items-end select-none">
                  <div className="flex items-center gap-1 text-amber-800 font-bold text-xs animate-pulse">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Vouch Pending</span>
                  </div>
                  <span className="text-[9px] text-amber-600 font-medium mt-0.5 font-mono">Limited Visibility</span>
                </div>
              )}
            </div>

            {/* Custom Onboarding checklist bar */}
            <div className="mt-6 border-t border-neutral-100 pt-5">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-widest mb-3">Onboarding Progress</h4>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
                  <span className="font-bold text-emerald-600 block mb-0.5">Step 1</span>
                  GST Onboarding
                  <span className="text-[9px] text-emerald-500 block font-mono font-bold mt-1">✓ Complete</span>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-medium">
                  <span className="font-bold text-emerald-600 block mb-0.5">Step 2</span>
                  Catalog Upload
                  <span className="text-[9px] text-emerald-500 block font-mono font-bold mt-1">✓ Complete</span>
                </div>
                <div className={`p-2.5 rounded-xl font-medium transition-all ${
                  isVouched 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                }`}>
                  <span className={`block mb-0.5 font-bold ${isVouched ? 'text-emerald-600' : 'text-amber-600'}`}>Step 3</span>
                  Cluster Vouch
                  <span className={`text-[9px] block font-mono font-bold mt-1`}>
                    {isVouched ? '✓ Complete' : '⏰ Pending'}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl font-medium transition-all ${
                  isVouched 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                    : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                }`}>
                  <span className={`block mb-0.5 font-bold ${isVouched ? 'text-emerald-600' : 'text-neutral-400'}`}>Step 4</span>
                  Global Search
                  <span className="text-[9px] block font-mono font-bold mt-1">
                    {isVouched ? '✓ Unlocked' : '🔒 Locked'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PATH TO INDEPENDENCE CARD (0 to 50 Orders Decay System) */}
          {(() => {
            const sellerOrders = ordersCount?.[currentSeller.id] || 0;
            const targetOrders = 50;
            const independenceProgress = Math.min(100, Math.round((sellerOrders / targetOrders) * 100));
            const ordersLeft = Math.max(0, targetOrders - sellerOrders);
            const isIndependent = sellerOrders >= targetOrders;

            return (
              <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm space-y-4" id="path-to-independence-card">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                      Decay System (0 to 50 Orders)
                    </span>
                    <h3 className="text-base font-bold text-neutral-800 font-display mt-1">Path to Independence</h3>
                  </div>
                  <span className="text-xs font-bold text-myntra-pink bg-myntra-pink/10 border border-myntra-pink/20 px-3 py-1 rounded-full font-mono">
                    {sellerOrders} / 50 Orders
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-600">Progress to Mentor Badge Detachment</span>
                    <span className="text-neutral-900 font-bold font-mono">{independenceProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200">
                    <div 
                      className="h-full bg-gradient-to-r from-myntra-pink via-myntra-orange to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${independenceProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-150 text-xs text-neutral-600 space-y-3">
                  {!isIndependent ? (
                    <p className="leading-relaxed">
                      Path to Independence: <strong>{sellerOrders}/50 Orders completed</strong>. <strong>{ordersLeft} orders left</strong> until mentor badge detaches.
                      <span className="block text-[11px] text-neutral-500 mt-1">
                        Orders 0–10 rely heavily on Kunal Textiles' borrowed trust (90% weighted score). As real customer reviews build, the mentor badge automatically detaches at 50 orders!
                      </span>
                    </p>
                  ) : (
                    <p className="text-emerald-800 font-medium leading-relaxed flex items-center gap-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span><strong>Independence Achieved!</strong> You have completed {sellerOrders} orders. The mentor badge has automatically detached, and you now run as an independent Established Seller on Myntra!</span>
                    </p>
                  )}

                  {onSimulateOrders && (
                    <div className="pt-2.5 border-t border-neutral-200/80 flex justify-between items-center flex-wrap gap-2">
                      <span className="text-[10px] text-neutral-500 font-mono font-semibold">Judge Demo Control:</span>
                      <button
                        onClick={() => onSimulateOrders(currentSeller.id, 10)}
                        className="bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                        id={`simulate-10-orders-seller-${currentSeller.id}`}
                      >
                        ⚡ Simulate +10 Orders
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* CELEBRATION BANNER FOR INDEPENDENT ESTABLISHED SELLER */}
          <AnimatePresence>
            {isIndependent && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 text-white rounded-3xl p-5 shadow-md flex items-center justify-between flex-wrap gap-4 border border-emerald-400/30"
                id="independence-celebration-banner"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 border border-white/20 shadow-inner">
                    🎉
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-white">🎉 Milestone Achieved!</h3>
                    <p className="text-xs text-emerald-100 mt-0.5 font-medium">
                      You are now a fully independent Established Seller on Myntra.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] bg-white text-emerald-950 font-mono font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                  ⭐ 50+ Orders Milestone
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DYNAMIC LIVE STATUS TRACKER CARD */}
          <AnimatePresence mode="wait">
            {isIndependent ? (
              <motion.div
                key="independent-seller-tracker"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-emerald-50 border-l-4 border-l-emerald-600 border border-emerald-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden"
                id="live-status-tracker-independent"
              >
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-100/60 rounded-full blur-xl"></div>
                <div className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-300">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-950 font-display text-sm">
                      ⭐ Status: Established & Independent Seller!
                    </h3>
                    <p className="text-xs text-emerald-900 mt-2 leading-relaxed">
                      Congratulations! You have completed <strong>{sellerOrders}+ orders</strong>. Your mentor badge has automatically detached because you have built full organic customer trust on Myntra.
                    </p>

                    <div className="mt-3.5 p-3.5 bg-white/90 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <div>
                          <p className="text-[11px] font-bold text-emerald-950">Full Independence Unlocked</p>
                          <p className="text-[10px] text-emerald-700 font-mono mt-0.5">Top Global Search Priority & Organic Badge</p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                        Established
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : isVouched ? (
              <motion.div
                key="active-trusted-tracker"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-emerald-50 border-l-4 border-l-emerald-500 border border-emerald-200/60 rounded-2xl p-5 shadow-xs relative overflow-hidden"
                id="live-status-tracker-vouched"
              >
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-100/40 rounded-full blur-xl"></div>
                <div className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                    <Unlock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-950 font-display text-sm">
                      🎉 Status: Active & Trusted. Your Peer-Vouched badge is now visible to buyers!
                    </h3>
                    <p className="text-xs text-emerald-900 mt-2 leading-relaxed">
                      Congratulations! Your craft legitimacy has been verified physically by cluster lead <strong>{currentApp?.mentorName || 'Kunal Textiles'}</strong>. You now possess the coveted <strong>Peer-Vouched Seller Badge</strong>. Standard buyer search restrictions are lifted.
                    </p>

                    <div className="mt-3.5 p-3.5 bg-white/80 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <div>
                          <p className="text-[11px] font-bold text-emerald-950">Active Boost Enabled</p>
                          <p className="text-[10px] text-emerald-700 font-mono mt-0.5">Estimated Search Boost: +10x Placement</p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                        Live on App
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : currentApp?.status === 'Pending Review' ? (
              <motion.div
                key="pending-app-tracker"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-amber-50 border-l-4 border-l-amber-500 border border-amber-200/80 rounded-2xl p-5 shadow-xs"
                id="live-status-tracker-app-pending"
              >
                <div className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
                    <Clock className="w-5 h-5 text-amber-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-950 font-display text-sm">
                      ⏳ Application Sent — Pending Review by {currentApp.mentorName}
                    </h3>
                    <p className="text-xs text-amber-900 mt-2 leading-relaxed">
                      Your mentorship application has been submitted to <strong>{currentApp.mentorName}</strong> in {currentApp.clusterCity}. The mentor will review your physical shop location and handloom inventory.
                    </p>
                    <div className="mt-3 p-3 bg-white/80 border border-amber-200 rounded-xl text-xs text-amber-900 font-mono italic">
                      Submitted Note: "{currentApp.customNote}"
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : currentApp?.status === 'Declined' ? (
              <motion.div
                key="declined-app-tracker"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-rose-50 border-l-4 border-l-rose-500 border border-rose-200/80 rounded-2xl p-5 shadow-xs"
                id="live-status-tracker-app-declined"
              >
                <div className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 border border-rose-300">
                    <XCircle className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-950 font-display text-sm">
                      ❌ Application Declined. You can apply to another mentor in your cluster.
                    </h3>
                    <p className="text-xs text-rose-900 mt-2 leading-relaxed">
                      Your mentorship request was not accepted. Browse other verified mentors in your cluster below and submit a new application!
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="restrictive-visibility-tracker"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-amber-50 border-l-4 border-l-amber-500 border border-amber-200/60 rounded-2xl p-5 shadow-xs"
                id="live-status-tracker-pending"
              >
                <div className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-950 font-display text-sm">
                      ⚠️ Unverified Seller: Apply to a mentor to unlock your Peer-Vouched badge.
                    </h3>
                    <p className="text-xs text-amber-900 mt-2 leading-relaxed">
                      To shield consumers from unvetted deliveries, new local weavers are initially placed under restricted search reach. Apply to an established mentor in your cluster below to get physically verified!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SECTION: BROWSE VERIFIED MENTORS */}
          <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm space-y-4" id="browse-mentors-section">
            <div className="flex justify-between items-start flex-wrap gap-2 border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] bg-myntra-pink/10 text-myntra-pink px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                  Cluster Directory
                </span>
                <h3 className="text-base font-bold text-neutral-800 font-display mt-1">Browse Verified Mentors</h3>
                <p className="text-xs text-neutral-500">Connect with established cluster leads in your region to apply for physical verification & borrowed trust.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {initialMentors.map(mentor => {
                const isAppliedToThisMentor = currentApp?.mentorId === mentor.id;
                const isPendingThisMentor = isAppliedToThisMentor && currentApp?.status === 'Pending Review';
                const isAcceptedThisMentor = isAppliedToThisMentor && currentApp?.status === 'Accepted';

                return (
                  <div key={mentor.id} className="bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 rounded-2xl p-4 flex flex-col justify-between h-full transition-all">
                    <div>
                      {/* Top Section Alignment */}
                      <div className="flex items-center gap-3">
                        <img src={mentor.image} alt={mentor.name} className="w-12 h-12 rounded-full shrink-0 object-cover border border-neutral-200 shadow-2xs" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-neutral-900 font-display truncate">{mentor.name}</h4>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">📍 {mentor.clusterCity}</span>
                        </div>
                      </div>

                      {/* Rating / Orders Stats Box */}
                      <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 my-3 grid grid-cols-2 text-center items-center">
                        <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-700">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          <span>{mentor.rating} Rating</span>
                        </div>
                        <div className="text-xs font-mono text-neutral-600 font-semibold text-center">
                          {mentor.lifetimeOrders.toLocaleString()} Orders
                        </div>
                      </div>

                      {/* Description Text */}
                      <p className="text-xs text-gray-500 line-clamp-2 min-h-[32px] mb-4 leading-relaxed">
                        {mentor.description}
                      </p>
                    </div>

                    {/* Bottom Action Button / Badge */}
                    <div className="mt-auto pt-2 border-t border-neutral-200/60">
                      {isAcceptedThisMentor || (isVouched && currentSeller.status === 'Vouched') ? (
                        <button disabled className="w-full bg-emerald-100 text-emerald-800 text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Mentorship Active
                        </button>
                      ) : isPendingThisMentor ? (
                        <button disabled className="w-full bg-amber-100 text-amber-800 text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Application Pending
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedMentorForModal(mentor);
                            setModalCustomNote(`Hi ${mentor.name.split(' ')[0]}, we manufacture high-quality ${currentSeller.category} in ${currentSeller.clusterCity} and would love your guidance and physical vouching on Myntra.`);
                          }}
                          className="w-full bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white text-[11px] font-bold py-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                          id={`apply-mentor-btn-${mentor.id}`}
                        >
                          <Send className="w-3 h-3 text-myntra-pink" />
                          <span>Apply for Mentorship</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Mentor Request Form & Informative sidebar */}
        <div className="space-y-6">
          {/* Mentor Request Form */}
          <div className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm">
            <div className="border-b border-neutral-100 pb-3.5 mb-4">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-1.5">
                <Send className="w-4 h-4 text-myntra-pink" /> Update Partner Pitch
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">Optimize the workshop details shown on Kunal Textiles' feed.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Textile Specialization</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-medium focus:ring-1 focus:ring-myntra-pink focus:border-myntra-pink outline-hidden"
                  id="form-category-select"
                >
                  <option value="Handloom Sarees">Handloom Sarees</option>
                  <option value="Silk Weaves">Silk Weaves</option>
                  <option value="Linen Kurtas">Linen Kurtas</option>
                  <option value="Ethnic Tops">Ethnic Tops</option>
                  <option value="Cotton Fabrics">Cotton Fabrics</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Business & Workshop Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe your family handloom workshop, number of active looms, and the specialty of your cotton/silk materials..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs leading-relaxed focus:ring-1 focus:ring-myntra-pink focus:border-myntra-pink outline-hidden"
                  id="form-description-textarea"
                />
              </div>

              {/* Checkbox permit */}
              <label className="flex items-start gap-2.5 p-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={permitContact}
                  onChange={(e) => setPermitContact(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-myntra-pink rounded border-neutral-300"
                  id="form-permit-checkbox"
                />
                <span className="text-[11px] text-neutral-600 leading-normal">
                  I permit verified Myntra mentors (like Kunal Textiles) to contact me directly on WhatsApp.
                </span>
              </label>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-3 rounded-xl uppercase tracking-wider transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5"
                id="submit-mentor-req-btn"
              >
                <Send className="w-3.5 h-3.5" />
                Update Directory Profile
              </button>
            </form>

            {/* Simulated success popup */}
            <AnimatePresence>
              {formSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs text-center"
                  id="form-success-alert"
                >
                  <span className="font-bold block">✓ Details Dispatched!</span>
                  Your updated profile is active on Kunal Textiles' Partner Discovery Feed.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Borrowed Trust Framework Guide */}
          <div className="bg-neutral-50 border border-neutral-200/60 rounded-3xl p-4 text-xs leading-relaxed text-neutral-500">
            <h4 className="font-bold text-neutral-700 mb-2 flex items-center gap-1">
              <Info className="w-4 h-4 text-myntra-pink" /> How It Works
            </h4>
            <ul className="space-y-2 list-decimal list-inside text-[11px] text-neutral-600">
              <li>
                <strong>Apply to Mentor</strong>: Browse available verified mentors in your cluster and submit a custom note.
              </li>
              <li>
                <strong>Physical Inspection</strong>: Approved mentors conduct physical audits (Physical Shop, Authentic Inventory, Seller Commitment).
              </li>
              <li>
                <strong>Earn Vouch</strong>: Once accepted, your Peer-Vouched badge unlocks instant global search visibility on Myntra!
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* QUICK APPLICATION MODAL */}
      <AnimatePresence>
        {selectedMentorForModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" id="application-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 border border-neutral-200 shadow-xl space-y-4"
            >
              <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-myntra-pink bg-myntra-pink/10 px-2 py-0.5 rounded-full">
                    Mentorship Application
                  </span>
                  <h3 className="text-lg font-bold text-neutral-800 font-display mt-1">
                    Apply to {selectedMentorForModal.name}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Applying as <strong>{currentSeller.name}</strong> ({currentSeller.clusterCity} • {currentSeller.category})
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedMentorForModal(null)} 
                  className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                  id="close-modal-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-150 text-xs text-neutral-600 flex items-center gap-3">
                  <img src={selectedMentorForModal.image} alt="" className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shrink-0" />
                  <div>
                    <p className="font-bold text-neutral-800">{selectedMentorForModal.name}</p>
                    <p className="text-[11px] text-neutral-500">📍 {selectedMentorForModal.clusterCity} Cluster Lead • ⭐ {selectedMentorForModal.rating}</p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                    Custom Note / Pitch to Mentor
                  </label>
                  <textarea
                    value={modalCustomNote}
                    onChange={(e) => setModalCustomNote(e.target.value)}
                    rows={4}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs leading-relaxed focus:ring-1 focus:ring-myntra-pink focus:border-myntra-pink outline-hidden"
                    placeholder="Introduce your workshop, loom capacity, and product line..."
                    id="modal-custom-note-textarea"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={() => setSelectedMentorForModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-all cursor-pointer"
                  id="cancel-modal-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (onApplyForMentorship) {
                      onApplyForMentorship(currentSeller.id, selectedMentorForModal.id, selectedMentorForModal.name, modalCustomNote);
                    }
                    setApplicationSentToast(`Application submitted to ${selectedMentorForModal.name}! Status: Pending Review.`);
                    setSelectedMentorForModal(null);
                    setTimeout(() => {
                      setApplicationSentToast(null);
                    }, 4000);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-myntra-pink hover:bg-myntra-pink/90 active:scale-98 text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  id="submit-modal-application-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
