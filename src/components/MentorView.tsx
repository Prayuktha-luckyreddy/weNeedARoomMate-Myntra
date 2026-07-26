import React, { useState } from 'react';
import { Seller, MentorshipApp } from '../types';
import { products } from './BuyerView';
import { 
  Users, 
  IndianRupee, 
  Award, 
  PhoneCall, 
  CheckCircle2, 
  X, 
  Search, 
  SlidersHorizontal,
  ShieldCheck,
  Send,
  ExternalLink,
  MessageSquareCode,
  Inbox,
  Check,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MentorViewProps {
  sellers: Seller[];
  setSellers?: React.Dispatch<React.SetStateAction<Seller[]>>;
  commission?: number;
  setCommission?: React.Dispatch<React.SetStateAction<number>>;
  onVouch: (sellerId: string) => void;
  ordersCount: Record<string, number>;
  applications?: MentorshipApp[];
  onAcceptApplication?: (applicationId: string, sellerId: string) => void;
  onDeclineApplication?: (applicationId: string) => void;
}

export default function MentorView({ 
  sellers, 
  setSellers, 
  commission, 
  setCommission, 
  onVouch, 
  ordersCount,
  applications = [],
  onAcceptApplication,
  onDeclineApplication
}: MentorViewProps) {
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Vouched'>('All');
  
  // Modal states
  const [selectedWhatsAppSeller, setSelectedWhatsAppSeller] = useState<Seller | null>(null);
  const [vouchChecklistSeller, setVouchChecklistSeller] = useState<Seller | null>(null);
  const [vouchingAppId, setVouchingAppId] = useState<string | null>(null);
  
  // Checklist confirmation state
  const [checklist, setChecklist] = useState({
    physicalShopVerified: false,
    authenticInventory: false,
    sellerCommitment: false
  });

  // Derived metrics
  const activeMenteesCount = sellers.filter(s => s.status === 'Vouched').length;
  
  // Calculate total purchases of vouched sellers
  const totalReferralPurchases = sellers.reduce((sum, s) => {
    if (s.status === 'Vouched' && s.id !== 'kunal-textiles') {
      return sum + (ordersCount[s.id] || 0);
    }
    return sum;
  }, 0);

  // Calculate total commission earned (2% of product price per purchase during mentorship period up to 50 orders)
  const totalCommissionEarned = sellers.reduce((sum, s) => {
    if (s.status === 'Vouched' && s.id !== 'kunal-textiles') {
      const product = products.find(p => p.sellerId === s.id);
      const price = product ? product.price : 1000;
      const totalOrders = ordersCount[s.id] || 0;
      const eligibleOrders = Math.min(50, totalOrders);
      return sum + (eligibleOrders * (price * 0.02));
    }
    return sum;
  }, 0);

  // Filtered applications
  const pendingApplications = applications.filter(a => a.status === 'Pending Review');

  // Filtered sellers list
  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          seller.clusterCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          seller.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' ? true : seller.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle vouch confirm
  const handleVouchConfirm = () => {
    if (vouchChecklistSeller) {
      if (vouchingAppId && onAcceptApplication) {
        onAcceptApplication(vouchingAppId, vouchChecklistSeller.id);
      } else {
        onVouch(vouchChecklistSeller.id);
      }
      setVouchChecklistSeller(null);
      setVouchingAppId(null);
      // Reset checklist
      setChecklist({
        physicalShopVerified: false,
        authenticInventory: false,
        sellerCommitment: false
      });
    }
  };

  const isChecklistComplete = Object.values(checklist).every(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6" id="mentor-view-container">
      {/* Profile Header Block */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-myntra-pink to-myntra-orange text-white flex items-center justify-center font-display font-bold text-2xl shadow-md border border-white/20">
            KT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-neutral-800 font-display">Kunal Textiles</h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Gold Partner
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">Cluster Lead: <strong>Secunderabad Textile Corridor</strong></p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-600">
              <span className="flex items-center gap-1 font-medium">
                ⭐ 4.8 Rating
              </span>
              <span className="text-neutral-300">•</span>
              <span className="font-semibold text-neutral-700">
                4,520 Lifetime Orders
              </span>
            </div>
          </div>
        </div>

        {/* Co-Signature Agreement Info */}
        <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 max-w-sm text-xs leading-relaxed text-neutral-500">
          <p className="font-bold text-neutral-700 mb-1 flex items-center gap-1">
            <Award className="w-4 h-4 text-myntra-pink" /> Borrowed Trust Guarantor
          </p>
          You are certified to physically vouch for weavers in your cluster. Vouching unlocks direct search exposure for them and credits you <strong>2% referral commission</strong> on each sale during mentorship (up to 50 orders).
        </div>
      </div>

      {/* Metrics Ribbon Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-myntra-pink/10 text-myntra-pink flex items-center justify-center border border-myntra-pink/20 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-neutral-400 text-[11px] font-bold uppercase tracking-wider block">Active Mentees</span>
            <span className="text-2xl font-bold text-neutral-800 font-display">{activeMenteesCount}</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Sellers Vouched</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-neutral-400 text-[11px] font-bold uppercase tracking-wider block">Commission Earned</span>
            <span className="text-2xl font-bold text-neutral-800 font-display">
              ₹{(commission !== undefined && commission > 0 ? commission : totalCommissionEarned).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">2% Commission / Order</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-neutral-400 text-[11px] font-bold uppercase tracking-wider block">Total Referrals</span>
            <span className="text-2xl font-bold text-neutral-800 font-display">{totalReferralPurchases}</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Sales via Vouched Badge</span>
          </div>
        </div>
      </div>

      {/* SECTION: INCOMING APPLICATIONS (ACCEPT / REJECT) */}
      <div className="mt-8 bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-xs" id="incoming-applications-section">
        <div className="flex justify-between items-center flex-wrap gap-2 mb-4 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-myntra-pink/10 text-myntra-pink flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-800 font-display">Incoming Mentorship Applications</h3>
              <p className="text-xs text-neutral-500">Review requests from new micro-weavers in your cluster seeking your physical vouch.</p>
            </div>
          </div>

          <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-myntra-pink/10 text-myntra-pink border border-myntra-pink/20">
            {pendingApplications.length} Pending
          </span>
        </div>

        {pendingApplications.length === 0 ? (
          <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-dashed border-neutral-200 text-xs text-neutral-500">
            <Clock className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
            <p className="font-semibold text-neutral-700">No pending mentorship applications.</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">New applications from cluster weavers will appear here instantly for review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingApplications.map(app => {
              const matchingSeller = sellers.find(s => s.id === app.sellerId || s.name.toLowerCase() === app.sellerName.toLowerCase());

              return (
                <div key={app.id} className="bg-neutral-50/80 border border-neutral-200 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-300 transition-all shadow-2xs">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-200 font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600 animate-pulse" /> Pending Review
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">{app.timestamp}</span>
                    </div>

                    <h4 className="font-bold text-sm text-neutral-900 font-display mt-2">{app.sellerName}</h4>
                    <p className="text-xs text-neutral-500 font-medium mt-0.5">
                      📍 {app.clusterCity} • <span className="text-neutral-700 font-semibold">{app.category}</span>
                    </p>

                    <div className="mt-3 p-3 bg-white border border-neutral-200/80 rounded-xl text-xs text-neutral-700 italic leading-relaxed">
                      "{app.customNote}"
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200/60 flex items-center gap-2">
                    <button
                      onClick={() => {
                        const sellerObj = matchingSeller || {
                          id: app.sellerId,
                          name: app.sellerName,
                          clusterCity: app.clusterCity,
                          category: app.category,
                          status: 'Pending' as const,
                          description: app.customNote,
                          whatsappNumber: "+91 99999"
                        };
                        setVouchChecklistSeller(sellerObj);
                        setVouchingAppId(app.id);
                        setChecklist({
                          physicalShopVerified: false,
                          authenticInventory: false,
                          sellerCommitment: false
                        });
                      }}
                      className="flex-1 bg-myntra-pink hover:bg-myntra-pink/90 active:scale-98 text-white text-xs font-bold py-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                      id={`accept-application-btn-${app.id}`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept & Vouch</span>
                    </button>

                    <button
                      onClick={() => onDeclineApplication && onDeclineApplication(app.id)}
                      className="px-3 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-neutral-900 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                      id={`decline-application-btn-${app.id}`}
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Discovery Feed Section */}
      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-neutral-800 font-display">Bharat Discovery Feed</h3>
            <p className="text-xs text-neutral-500">Find, connect with, and physically verify local weavers in your vicinity.</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search cluster, weaver..."
                className="w-full bg-white border border-neutral-200 pl-9 pr-4 py-2 rounded-xl text-xs focus:ring-1 focus:ring-myntra-pink focus:border-myntra-pink outline-hidden"
              />
            </div>
            
            {/* Filter Toggle */}
            <div className="flex bg-neutral-200/60 p-0.5 rounded-xl border border-neutral-200">
              {(['All', 'Pending', 'Vouched'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    statusFilter === filter 
                      ? 'bg-white text-neutral-800 shadow-xs' 
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  id={`filter-${filter}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Discovery Feed List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredSellers.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full bg-white rounded-2xl p-8 border border-neutral-100 text-center"
              >
                <p className="text-xs text-neutral-400 font-mono">No weavers match your search or filter criteria.</p>
              </motion.div>
            ) : (
              filteredSellers.map((seller) => {
                const sellerOrders = ordersCount[seller.id] || 0;
                const isPending = seller.status === 'Pending';

                return (
                  <motion.div
                    key={seller.id}
                    layoutId={`seller-card-${seller.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white rounded-2xl p-5 border shadow-2xs flex flex-col justify-between transition-all ${
                      seller.status === 'Vouched' 
                        ? 'border-emerald-100 bg-gradient-to-br from-white to-emerald-50/10' 
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div>
                      {/* Badge and Location Row */}
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                          {seller.category}
                        </span>
                        
                        {/* Status Label */}
                        {seller.status === 'Vouched' ? (
                          <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded font-bold flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Vouched
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold flex items-center gap-1 font-mono animate-pulse">
                            ⚠️ Pending Vouch
                          </span>
                        )}
                      </div>

                      {/* Seller Name and Cluster */}
                      <h4 className="font-display font-bold text-base text-neutral-800 mt-2.5">{seller.name}</h4>
                      
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5 font-medium">
                        <MapPinIcon className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{seller.clusterCity} Cluster</span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                        {seller.description}
                      </p>

                      {/* Order Count tracked info */}
                      {seller.status === 'Vouched' && (
                        <div className="mt-4 bg-emerald-50/50 border border-emerald-100/50 rounded-xl px-3 py-2 flex items-center justify-between text-[11px] text-emerald-800">
                          <span className="font-medium flex items-center gap-1">
                            <IndianRupee className="w-3 h-3 text-emerald-600" /> Sales Commission:
                          </span>
                          <span className="font-bold font-mono">
                            {sellerOrders} orders (₹{sellerOrders * 250})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons footer */}
                    <div className="mt-5 border-t border-neutral-100 pt-4 flex gap-2.5">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => setSelectedWhatsAppSeller(seller)}
                            className="flex-1 border border-neutral-200 hover:border-neutral-300 text-neutral-700 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-neutral-50"
                            id={`connect-whatsapp-${seller.id}`}
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                            WhatsApp
                          </button>
                          <button
                            onClick={() => {
                              setVouchChecklistSeller(seller);
                              // Reset check
                              setChecklist({
                                physicalShopVerified: false,
                                authenticInventory: false,
                                sellerCommitment: false
                              });
                            }}
                            className="flex-1 bg-myntra-pink hover:bg-opacity-90 active:scale-98 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                            id={`vouch-btn-${seller.id}`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Vouch
                          </button>
                        </>
                      ) : (
                        <div className="w-full bg-emerald-50 border border-emerald-200/50 rounded-xl py-2.5 px-3 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 select-none">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>You have vouched for this partner</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MODAL 1: WHATSAPP SIMULATED DRAWER */}
      <AnimatePresence>
        {selectedWhatsAppSeller && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="whatsapp-modal">
            <div className="absolute inset-0" onClick={() => setSelectedWhatsAppSeller(null)}></div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative z-10 border border-neutral-100"
            >
              <button 
                onClick={() => setSelectedWhatsAppSeller(null)}
                className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  WA
                </div>
                <div>
                  <h3 className="font-bold text-neutral-800 text-sm">Simulated Chat with Weaver</h3>
                  <p className="text-[10px] text-emerald-600 font-bold">WhatsApp Direct Bridge</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-150">
                  <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Recipient Phone</span>
                  <span className="text-sm font-semibold text-neutral-800">{selectedWhatsAppSeller.whatsappNumber}</span>
                  <span className="text-xs text-neutral-500 block">({selectedWhatsAppSeller.name})</span>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl space-y-2">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Pre-Filled Prompt Message:</span>
                  <p className="text-xs italic text-neutral-600 leading-relaxed bg-white p-3 rounded-xl border border-emerald-200">
                    "Namaste {selectedWhatsAppSeller.name}, I am Kunal Textiles. I am assigned as your Myntra Cluster Mentor. I would like to arrange a physical audit of your {selectedWhatsAppSeller.category} workshops in {selectedWhatsAppSeller.clusterCity} so that we can register your Peer-Vouch badge. Let me know when is a good time!"
                  </p>
                </div>

                <div className="text-center p-3 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50">
                  <MessageSquareCode className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
                  <p className="text-[10px] text-neutral-500">In production, this triggers the official WhatsApp Business API deep-link connection to bridge the cluster lead and weaver.</p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button 
                  onClick={() => setSelectedWhatsAppSeller(null)}
                  className="flex-1 border border-neutral-200 hover:bg-neutral-50 font-bold py-3 rounded-xl text-xs text-neutral-700 uppercase tracking-wide"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert(`In a real application, this would redirect you to: https://wa.me/${selectedWhatsAppSeller.whatsappNumber.replace(/[^0-9]/g, '')}`);
                    setSelectedWhatsAppSeller(null);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  Open WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: PEER VOUCH PHYSICAL CHECKLIST AUDIT */}
      <AnimatePresence>
        {vouchChecklistSeller && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="vouch-checklist-modal">
            <div className="absolute inset-0" onClick={() => setVouchChecklistSeller(null)}></div>
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative z-10 border border-neutral-100 max-h-[90%] overflow-y-auto"
            >
              <button 
                onClick={() => setVouchChecklistSeller(null)}
                className="absolute top-4 right-4 p-1 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center pb-2 border-b border-neutral-100 mb-5">
                <div className="w-12 h-12 rounded-full bg-myntra-pink/10 text-myntra-pink flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-neutral-800">Cluster Physical Verification Audit</h3>
                <p className="text-xs text-neutral-500 mt-1">Sponsor: <strong>{vouchChecklistSeller.name}</strong> ({vouchChecklistSeller.clusterCity})</p>
              </div>

              <p className="text-xs text-neutral-500 leading-normal mb-4 bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-100 font-medium">
                ⚠️ Co-Signature Warning: By checking these items, you legally verify that you have visited the facility in person. Any buyer disputes on product quality may affect your Gold Partner Rating.
              </p>

              {/* Checklist Items */}
              <div className="space-y-3.5">
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors select-none">
                  <input 
                    type="checkbox"
                    checked={checklist.physicalShopVerified}
                    onChange={(e) => setChecklist(prev => ({ ...prev, physicalShopVerified: e.target.checked }))}
                    className="w-5 h-5 mt-0.5 accent-myntra-pink rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">1. Physical Shop / Workshop Verified</span>
                    <span className="text-[11px] text-neutral-500 block mt-0.5">Confirmed physical existence in the local cluster.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors select-none">
                  <input 
                    type="checkbox"
                    checked={checklist.authenticInventory}
                    onChange={(e) => setChecklist(prev => ({ ...prev, authenticInventory: e.target.checked }))}
                    className="w-5 h-5 mt-0.5 accent-myntra-pink rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">2. Authentic Inventory</span>
                    <span className="text-[11px] text-neutral-500 block mt-0.5">Confirmed real products, not drop-shipped or fake listings.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors select-none">
                  <input 
                    type="checkbox"
                    checked={checklist.sellerCommitment}
                    onChange={(e) => setChecklist(prev => ({ ...prev, sellerCommitment: e.target.checked }))}
                    className="w-5 h-5 mt-0.5 accent-myntra-pink rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-800 block">3. Seller Commitment</span>
                    <span className="text-[11px] text-neutral-500 block mt-0.5">Agreed to maintain shipping timelines and basic quality standards.</span>
                  </div>
                </label>
              </div>

              {/* Vouch Action */}
              <div className="mt-6 border-t border-neutral-100 pt-5 flex gap-3">
                <button
                  onClick={() => setVouchChecklistSeller(null)}
                  className="flex-1 border border-neutral-200 hover:bg-neutral-50 py-3 rounded-xl font-bold text-xs uppercase tracking-wide text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  disabled={!isChecklistComplete}
                  onClick={handleVouchConfirm}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wide text-white flex items-center justify-center gap-1.5 shadow-md ${
                    isChecklistComplete 
                      ? 'bg-myntra-pink hover:opacity-95' 
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none'
                  }`}
                  id="vouch-confirm-submit-btn"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Issue Vouch Badge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple custom Map Pin component to avoid build issues
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
