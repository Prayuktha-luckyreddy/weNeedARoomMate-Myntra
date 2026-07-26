import React, { useState } from 'react';
import { Seller } from '../types';
import { 
  Heart, 
  ShoppingBag, 
  Share2, 
  Star, 
  MapPin, 
  Sparkles, 
  CheckCircle, 
  ShieldCheck, 
  Info, 
  ChevronRight,
  Award,
  ArrowLeft,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BuyerViewProps {
  sellers: Seller[];
  setSellers?: React.Dispatch<React.SetStateAction<Seller[]>>;
  commission?: number;
  setCommission?: React.Dispatch<React.SetStateAction<number>>;
  onInstantBuy: (sellerId: string) => void;
  onSimulateOrders?: (sellerId: string, count?: number) => void;
  ordersCount: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  sellerId: string;
  price: number;
  originalPrice: number;
  discount: string;
  description: string;
  rating: number;
  ratingCount: number;
  category: string;
  features: string[];
  fabricCare: string;
  deliveryDays: number;
  imageType: 'kurti' | 'saree' | 'top' | 'jacket';
  bgGradient: string;
  image: string;
}

export function calculateTrustMetrics(orders: number, nativeRating: number = 4.3) {
  const maxOrders = 50;
  const currentOrders = Math.min(maxOrders, Math.max(0, orders));
  
  // 0 to 50 decay formula:
  // At 0-10 orders: 90%+ mentor weight
  // Smooth linear decay from 100% mentor weight to 0% mentor weight at 50 orders
  const mentorWeightRatio = Math.max(0, (maxOrders - currentOrders) / maxOrders);
  const sellerWeightRatio = 1 - mentorWeightRatio;
  
  const mentorBaseScore = 96; // Kunal Textiles 4.8★ * 20 = 96
  const sellerBaseScore = Math.round(nativeRating * 20); // 4.3★ * 20 = 86
  
  const trustScore = Math.round((mentorWeightRatio * mentorBaseScore) + (sellerWeightRatio * sellerBaseScore));
  const isIndependent = currentOrders >= maxOrders;
  const ordersRemaining = Math.max(0, maxOrders - currentOrders);
  
  return {
    trustScore,
    mentorWeightPct: Math.round(mentorWeightRatio * 100),
    sellerWeightPct: Math.round(sellerWeightRatio * 100),
    isIndependent,
    ordersRemaining,
    currentOrders
  };
}

export const products: Product[] = [
  {
    id: 'product-1',
    name: "Hand-woven Organic Summer Kurti",
    sellerId: 'ashas-handlooms',
    price: 899,
    originalPrice: 1999,
    discount: "55% OFF",
    description: "A lightweight, breathable organic summer kurti. Handcrafted with authentic looms with delicate floral elements.",
    rating: 4.3,
    ratingCount: 124,
    category: "Ethnic Wear",
    features: ["100% Cotton / Khadi", "Authentically hand-spun", "Skin-friendly dyes"],
    fabricCare: "Organic Fabric, Dry Clean Preferred",
    deliveryDays: 4,
    imageType: 'kurti',
    bgGradient: 'from-amber-50 to-rose-50',
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'product-2',
    name: "Pure Coimbatore Silk Saree",
    sellerId: 'sravanthi-silks',
    price: 4500,
    originalPrice: 9999,
    discount: "55% OFF",
    description: "Traditional Kanjivaram-style soft silk saree sourced from Coimbatore weavers. Features fine gold zari borders and rich pallu work.",
    rating: 4.7,
    ratingCount: 86,
    category: "Sarees",
    features: ["Pure Coimbatore Silk", "Authentic Zari Work", "Silk Mark certified eligible"],
    fabricCare: "Dry Clean Only, Iron on reverse with low heat",
    deliveryDays: 5,
    imageType: 'saree',
    bgGradient: 'from-purple-50 to-pink-50',
    image: "https://saundaryamfashions.com/cdn/shop/files/2_105a5709-1985-4abc-a3a6-f7e7990355d9.jpg?v=1694522209&width=713"
  },
  {
    id: 'product-3',
    name: "Hand-block Printed Cotton Top",
    sellerId: 'jaipur-block-prints',
    price: 749,
    originalPrice: 1499,
    discount: "50% OFF",
    description: "Authentic Dabu-printed summer crop top. Hand block-printed using direct mud-resist techniques with organic indigo dyes.",
    rating: 4.5,
    ratingCount: 215,
    category: "Ethnic Tops",
    features: ["Pure Cambric Cotton", "Natural Indigo dyes", "Woodblock handcrafted design"],
    fabricCare: "Wash separately in cold water with mild detergent",
    deliveryDays: 3,
    imageType: 'top',
    bgGradient: 'from-cyan-50 to-blue-50',
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'product-4',
    name: "Classic Linen Nehru Jacket",
    sellerId: 'bihar-handlooms',
    price: 1299,
    originalPrice: 2799,
    discount: "53% OFF",
    description: "An elegant classic-fit Nehru Jacket made from premium Bhagalpur handloom linen. Perfect for semi-formal festive occasions.",
    rating: 4.4,
    ratingCount: 98,
    category: "Men's Jackets",
    features: ["Premium Bhagalpur Linen", "Handwoven texture", "Elegant brass-style buttons"],
    fabricCare: "Gentle machine wash or dry clean, hot iron",
    deliveryDays: 4,
    imageType: 'jacket',
    bgGradient: 'from-neutral-50 to-amber-50',
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 'product-5',
    name: "Authentic Chanderi Silk Dupatta",
    sellerId: 'kunal-textiles',
    price: 1899,
    originalPrice: 3899,
    discount: "51% OFF",
    description: "Premium handcrafted Chanderi silk dupatta with delicate golden zari borders. Handwoven directly by Master Mentor Kunal Textiles.",
    rating: 4.9,
    ratingCount: 340,
    category: "Silk Dupattas",
    features: ["Pure Chanderi Silk", "Authentic Metallic Zari", "Silk Mark certified"],
    fabricCare: "Dry Clean Only",
    deliveryDays: 3,
    imageType: 'saree',
    bgGradient: 'from-amber-50 to-emerald-50',
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800"
  }
];

function renderProductImage(product?: Product | 'kurti' | 'saree' | 'top' | 'jacket', zoomDetail: boolean = false) {
  if (zoomDetail) {
    return (
      <div className="relative w-full h-64 flex items-center justify-center bg-gradient-to-tr from-rose-100 to-amber-100 rounded-2xl shadow-inner border border-amber-200 overflow-hidden">
        <div className="absolute inset-0 opacity-25" style={{
          backgroundImage: 'radial-gradient(#ff3f6c 1px, transparent 1px), radial-gradient(#f54e18 1px, transparent 1px)',
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0, 6px 6px'
        }}></div>
        <div className="text-center p-3 z-10 bg-white/90 backdrop-blur-xs rounded-xl m-4 border border-white/50 shadow-sm">
          <Award className="w-8 h-8 text-amber-600 mx-auto mb-1 animate-pulse" />
          <h4 className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider">Heritage Texture Zoom</h4>
          <p className="text-[9px] text-neutral-500 leading-tight mt-1 px-1">Close-up of handloom warp-weft weave patterns. Authentically certified by local master weavers.</p>
        </div>
      </div>
    );
  }

  // If product object is passed and has a valid image URL
  if (typeof product === 'object' && product?.image) {
    return (
      <div className="relative w-full h-full overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-100 shadow-inner">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105" 
        />
        <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs border border-neutral-200 rounded-full px-2 py-0.5 text-[9px] font-bold text-neutral-800 tracking-wider uppercase shadow-xs">
          {product.category}
        </span>
      </div>
    );
  }

  const type = typeof product === 'string' ? product : product?.imageType || 'kurti';

  switch (type) {
    case 'saree':
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-purple-50 to-pink-50 rounded-2xl shadow-inner border border-purple-100 py-6">
          <svg viewBox="0 0 100 120" className="w-28 h-36 sm:w-36 sm:h-48 drop-shadow-lg">
            <path d="M30,20 C45,15 55,15 70,20 L85,85 C80,105 40,110 25,95 L15,35 Z" fill="#7c3aed" />
            <path d="M15,35 L25,95" stroke="#f59e0b" strokeWidth="3.5" />
            <path d="M30,20 L70,20" stroke="#f59e0b" strokeWidth="2" />
            <path d="M85,85 C80,105 40,110 25,95" stroke="#f59e0b" strokeWidth="3" fill="none" />
            <circle cx="45" cy="55" r="3" fill="#f59e0b" />
            <circle cx="65" cy="55" r="3" fill="#f59e0b" />
          </svg>
          <span className="absolute bottom-3 right-3 bg-white/90 border border-purple-200 rounded px-1.5 py-0.5 text-[8px] font-bold text-purple-800 tracking-wider uppercase">
            Pure Silk
          </span>
        </div>
      );
    case 'top':
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-cyan-50 to-blue-50 rounded-2xl shadow-inner border border-cyan-100 py-6">
          <svg viewBox="0 0 100 120" className="w-28 h-36 sm:w-36 sm:h-48 drop-shadow-lg">
            <path d="M38,30 L25,42 L32,52 L38,47 L36,90 L64,90 L62,47 L68,52 L75,42 L62,30 Z" fill="#0284c7" />
            <circle cx="50" cy="65" r="3" fill="#e0f2fe" />
          </svg>
          <span className="absolute bottom-3 right-3 bg-white/90 border border-cyan-200 rounded px-1.5 py-0.5 text-[8px] font-bold text-cyan-800 tracking-wider uppercase">
            100% Cotton
          </span>
        </div>
      );
    case 'jacket':
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-neutral-50 to-amber-50 rounded-2xl shadow-inner border border-amber-100 py-6">
          <svg viewBox="0 0 100 120" className="w-28 h-36 sm:w-36 sm:h-48 drop-shadow-lg">
            <path d="M42,32 L24,35 L28,102 L72,102 L76,35 L58,32 Z" fill="#d97706" />
          </svg>
          <span className="absolute bottom-3 right-3 bg-white/90 border border-amber-200 rounded px-1.5 py-0.5 text-[8px] font-bold text-amber-800 tracking-wider uppercase">
            Linen Weave
          </span>
        </div>
      );
    case 'kurti':
    default:
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-amber-50 to-rose-50 rounded-2xl shadow-inner border border-rose-100 py-6">
          <svg viewBox="0 0 100 120" className="w-28 h-36 sm:w-36 sm:h-48 drop-shadow-lg">
            <path d="M35,28 L20,40 L28,50 L34,44 L32,105 L68,105 L66,44 L72,50 L80,40 L65,28 Z" fill="#ff3f6c" />
          </svg>
          <span className="absolute bottom-3 right-3 bg-white/90 border border-amber-200 rounded px-1.5 py-0.5 text-[8px] font-bold text-amber-800 tracking-wider uppercase">
            100% Khadi
          </span>
        </div>
      );
  }
}

export default function BuyerView({ sellers, setSellers, commission, setCommission, onInstantBuy, onSimulateOrders, ordersCount }: BuyerViewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [showVouchModal, setShowVouchModal] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [activeImageTab, setActiveImageTab] = useState(0);

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  // Handle back to grid view
  const handleBackToGrid = () => {
    setSelectedProductId(null);
    setActiveImageTab(0);
  };

  // Find active product safely with string conversion
  const activeProduct = products.find(p => String(p?.id) === String(selectedProductId));
  const currentProduct = activeProduct;

  // Safe fallback lookup for sellerName and sellerStatus
  const sellerName = (currentProduct as any)?.seller || "Asha's Handlooms";
  const sellerStatus = (sellers || []).find(s => 
    s?.name?.trim().toLowerCase() === sellerName?.trim().toLowerCase() ||
    s?.id?.trim().toLowerCase() === currentProduct?.sellerId?.trim().toLowerCase() ||
    s?.name?.trim().toLowerCase() === currentProduct?.sellerId?.trim().toLowerCase()
  )?.status || 'Pending';

  const isVouched = sellerStatus === 'Vouched';

  // Safely find active seller
  const activeSeller = currentProduct 
    ? ((sellers || []).find(s => 
        s?.name?.trim().toLowerCase() === sellerName?.trim().toLowerCase() ||
        s?.id?.trim().toLowerCase() === currentProduct?.sellerId?.trim().toLowerCase() ||
        s?.name?.trim().toLowerCase() === currentProduct?.sellerId?.trim().toLowerCase()
      ) || {
        id: currentProduct?.sellerId || "unknown-seller",
        name: sellerName,
        clusterCity: "Local Cluster",
        category: currentProduct?.category || "Handloom",
        status: sellerStatus,
        description: currentProduct?.description || "Master Weaver Partner",
        whatsappNumber: "+91 99999"
      })
    : null;

  // Orders completed for current seller
  const sellerOrders = activeSeller ? (ordersCount?.[activeSeller.id] || 0) : 0;
  const trustMetrics = calculateTrustMetrics(sellerOrders, currentProduct?.rating || 4.3);

  const handleInstantBuyClick = () => {
    if (activeSeller) {
      onInstantBuy(activeSeller.id);
      setBuySuccess(true);
      setTimeout(() => {
        setBuySuccess(false);
      }, 3000);
    }
  };

  // Safe Try/Catch render block for PDP
  const renderProductDetailPage = () => {
    try {
      if (!currentProduct) return null;

      return (
        <motion.div
          key={`pdp-${currentProduct?.id}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          id="product-pdp-screen"
        >
          {/* Image Showcase segment */}
          <div className="relative bg-neutral-50 h-80 overflow-hidden group border-b border-neutral-100">
            <div className="w-full h-full flex items-center justify-center p-4 relative">
              {activeImageTab === 0 ? (
                renderProductImage(currentProduct)
              ) : (
                renderProductImage(currentProduct, true)
              )}
            </div>

            {/* Image tab dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
              <button 
                onClick={() => setActiveImageTab(0)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${activeImageTab === 0 ? 'bg-myntra-pink w-4' : 'bg-neutral-300'}`}
                id="img-tab-dot-1"
              ></button>
              <button 
                onClick={() => setActiveImageTab(1)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${activeImageTab === 1 ? 'bg-myntra-pink w-4' : 'bg-neutral-300'}`}
                id="img-tab-dot-2"
              ></button>
            </div>

            {/* Rating Float Badge */}
            <div className="absolute bottom-4 left-4 bg-white/95 border border-neutral-200/50 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-sm z-10">
              <span className="text-[11px] font-bold text-neutral-800">{currentProduct?.rating || 4.5}</span>
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <span className="text-neutral-400 text-[10px]">|</span>
              <span className="text-[10px] text-neutral-500 font-medium">{currentProduct?.ratingCount || 10}</span>
            </div>
          </div>

          {/* Info and Purchase Details */}
          <div className="p-4 bg-white space-y-5">
            <div>
              <p className="text-sm font-bold text-neutral-400 tracking-wider uppercase font-display">{currentProduct?.category}</p>
              <h2 className="text-lg font-medium text-neutral-800 tracking-tight leading-snug mt-0.5">
                {currentProduct?.name}
              </h2>
              
              {/* Price Tag Row */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-bold text-neutral-900">₹{currentProduct?.price}</span>
                <span className="text-sm text-neutral-400 line-through">₹{currentProduct?.originalPrice}</span>
                <span className="text-xs font-bold text-myntra-orange bg-myntra-orange/10 px-1.5 py-0.5 rounded">
                  ({currentProduct?.discount})
                </span>
              </div>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">inclusive of all taxes</p>
            </div>

            {/* Seller Peer Trust Verification Box */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">Loom Origin Partner</span>
                  <span className="text-sm font-bold text-neutral-800 block leading-tight">{activeSeller?.name || "Artisan Partner"}</span>
                  <div className="flex items-center gap-1 mt-1 text-neutral-500">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="text-xs">{activeSeller?.clusterCity || "Local"} Textile Cluster</span>
                  </div>
                </div>

                {/* Badge Conditional Rendering */}
                <AnimatePresence mode="wait">
                  {!isVouched ? (
                    <motion.div 
                      key="new-seller-badge"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-neutral-200 border border-neutral-300 text-neutral-600 px-3 py-1.5 rounded-xl flex flex-col items-center select-none shrink-0"
                    >
                      <span className="text-[10px] font-bold tracking-tight text-center">⚠️ New Seller</span>
                      <span className="text-[9px] text-neutral-500 mt-0.5 tracking-tight font-mono">Limited History</span>
                    </motion.div>
                  ) : trustMetrics.isIndependent ? (
                    <motion.div
                      key="independent-badge"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl flex flex-col items-center shadow-xs shrink-0 select-none"
                    >
                      <div className="flex items-center gap-1 text-emerald-800 font-bold text-[10px] uppercase tracking-wide">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>⭐ Established Seller</span>
                      </div>
                      <span className="text-[9px] text-emerald-600 font-semibold mt-0.5 font-mono">
                        50+ Orders Achieved
                      </span>
                    </motion.div>
                  ) : (
                    <motion.button 
                      key="vouched-badge"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      onClick={() => setShowVouchModal(true)}
                      className="bg-emerald-50 border border-emerald-200 hover:border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-xl flex flex-col items-center shadow-xs cursor-pointer text-left relative overflow-hidden group active:scale-95 transition-transform shrink-0"
                      id="peer-vouched-badge-btn"
                    >
                      <span className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-emerald-100 opacity-60 animate-ping"></span>
                      <div className="flex items-center gap-1 text-emerald-700 font-bold text-[10px] uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
                        <span>🤝 Peer-Vouched</span>
                      </div>
                      <span className="text-[9px] text-emerald-600 font-semibold underline mt-0.5 flex items-center gap-0.5">
                        Verified Legit <Info className="w-2.5 h-2.5" />
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Explanatory notes */}
              {!isVouched ? (
                <div className="text-[10px] text-neutral-500 leading-tight pt-2.5 border-t border-neutral-150">
                  This seller is freshly registered in the {activeSeller?.clusterCity || "local"} cluster. Pending physical vouch audit from an established mentor.
                </div>
              ) : trustMetrics.isIndependent ? (
                <div className="pt-2.5 border-t border-neutral-150 flex items-center justify-between text-[11px] flex-wrap gap-2">
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    <span>Proven Independent Track Record ({sellerOrders}+ Orders)</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    Mentor Detached
                  </span>
                </div>
              ) : (
                <div className="pt-2.5 border-t border-neutral-150 flex items-center justify-between text-[11px] flex-wrap gap-2">
                  <span className="text-neutral-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Mentored by <strong>Kunal Textiles</strong></span>
                  </span>
                  <button 
                    onClick={() => setShowVouchModal(true)} 
                    className="text-myntra-pink hover:underline font-bold text-[10px] flex items-center gap-0.5 shrink-0 cursor-pointer"
                    id="view-mentor-guarantee-link"
                  >
                    View Mentor Guarantee <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* DYNAMIC TRUST SCORE & DECAY SYSTEM BOX */}
            {isVouched && (
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3" id="dynamic-trust-score-pdp-box">
                {!trustMetrics.isIndependent ? (
                  <>
                    <div className="flex justify-between items-center flex-wrap gap-1">
                      <div>
                        <span className="text-[9px] text-emerald-700 font-extrabold uppercase tracking-widest font-mono block">
                          Dynamic Trust Score & Decay
                        </span>
                        <h4 className="text-xs font-bold text-neutral-900 mt-0.5">
                          Trust Score: <span className="text-emerald-700 font-mono text-sm">{trustMetrics.trustScore}/100</span>
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono">
                        {trustMetrics.mentorWeightPct}% Mentor Weight
                      </span>
                    </div>

                    {/* Trust Score Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden flex border border-neutral-250">
                        <div 
                          className="bg-emerald-600 h-full transition-all duration-300" 
                          style={{ width: `${trustMetrics.mentorWeightPct}%` }}
                        ></div>
                        <div 
                          className="bg-myntra-pink h-full transition-all duration-300" 
                          style={{ width: `${trustMetrics.sellerWeightPct}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-neutral-500 font-medium">
                        <span>Kunal Textiles ({trustMetrics.mentorWeightPct}%)</span>
                        <span>Customer Rating ({trustMetrics.sellerWeightPct}%)</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-neutral-600 leading-tight">
                      Orders 0–10 are 90%+ weighted by mentor rating. As customer orders complete, the mentor badge automatically detaches at 50 orders (<strong>{trustMetrics.ordersRemaining} orders left</strong>).
                    </p>
                  </>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>⭐ 4.6★ Established Independent Seller</span>
                    </div>
                    <p className="text-[10px] text-emerald-700 leading-tight">
                      Seller has completed {trustMetrics.currentOrders}+ orders on Myntra! The mentor badge has automatically detached as full independence was achieved.
                    </p>
                  </div>
                )}

                {/* Test Control: Simulate +10 Orders */}
                {onSimulateOrders && (
                  <div className="pt-2 border-t border-emerald-200/80 flex justify-between items-center">
                    <span className="text-[10px] text-neutral-500 font-mono font-semibold">Judge Demo Control:</span>
                    <button
                      onClick={() => onSimulateOrders(activeSeller?.id || currentProduct.sellerId, 10)}
                      className="bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs cursor-pointer flex items-center gap-1"
                      id="simulate-10-orders-pdp-btn"
                    >
                      ⚡ Simulate +10 Orders
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Select Size</h3>
                <span className="text-xs text-myntra-pink font-bold hover:underline cursor-pointer">Size Chart</span>
              </div>
              <div className="flex gap-2 mt-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 rounded-full border text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      selectedSize === size
                        ? 'border-myntra-pink text-myntra-pink bg-myntra-pink/5 ring-1 ring-myntra-pink shadow-xs'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Product description & bullet list */}
            <div className="space-y-2 border-t border-neutral-100 pt-4">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Product Details</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{currentProduct?.description}</p>
              <ul className="grid grid-cols-1 gap-1.5 mt-2">
                {currentProduct?.features?.map((feature, idx) => (
                  <li key={idx} className="text-xs text-neutral-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-myntra-pink shrink-0"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery and Fabric Care */}
            <div className="border-t border-neutral-100 pt-4 space-y-3">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-widest">Delivery & Care</h3>
              <div className="flex gap-3 text-xs leading-relaxed text-neutral-600">
                <span className="bg-neutral-100 rounded-lg p-2 h-max text-neutral-600">🚚</span>
                <div>
                  <p className="font-semibold text-neutral-800">Delivered within {currentProduct?.deliveryDays || 5} days</p>
                  <p className="text-[10px] text-neutral-500">Fastest delivery guaranteed in {activeSeller?.clusterCity || "local"} clusters.</p>
                </div>
              </div>
              <div className="flex gap-3 text-xs leading-relaxed text-neutral-600">
                <span className="bg-neutral-100 rounded-lg p-2 h-max text-neutral-600">🌿</span>
                <div>
                  <p className="font-semibold text-neutral-800">{currentProduct?.fabricCare}</p>
                  <p className="text-[10px] text-neutral-500">Traditional handloom materials benefit from mild care.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Bottom Action Buttons */}
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 py-3 flex gap-3 z-10 shadow-lg mt-6">
            <button 
              onClick={handleBackToGrid}
              className="flex-1 border border-neutral-300 text-neutral-800 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors cursor-pointer"
              id="back-to-grid-bottom-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Grid
            </button>
            <button 
              onClick={handleInstantBuyClick}
              disabled={buySuccess}
              className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                buySuccess 
                  ? 'bg-emerald-600 shadow-none' 
                  : 'bg-gradient-to-r from-myntra-pink to-myntra-orange hover:opacity-90 active:scale-98'
              }`}
              id="instant-buy-btn"
            >
              {buySuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Order Placed!
                </>
              ) : (
                <>
                  ⚡ Instant Buy
                </>
              )}
            </button>
          </div>
        </motion.div>
      );
    } catch (err) {
      console.error("PDP Error caught defensively:", err);
      return (
        <div className="p-6 text-center space-y-4">
          <p className="text-sm font-bold text-red-500">Failed to render product details safely.</p>
          <button 
            onClick={handleBackToGrid}
            className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs uppercase tracking-wider font-bold"
          >
            Back to Catalog
          </button>
        </div>
      );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-neutral-200 rounded-[32px] shadow-2xl overflow-hidden my-4 relative" id="buyer-app-pdp-frame">
      {/* Phone Notch/Header Accent */}
      <div className="bg-neutral-900 text-white text-[11px] px-6 py-1 flex justify-between items-center font-mono select-none">
        <span>09:41</span>
        <div className="w-20 h-4 bg-black rounded-b-xl mx-auto absolute left-1/2 -translate-x-1/2 top-0"></div>
        <div className="flex gap-1.5 items-center">
          <span>5G</span>
          <div className="w-5 h-2.5 border border-white/80 rounded-sm p-0.5 flex items-center">
            <div className="w-full h-full bg-white rounded-2xs"></div>
          </div>
        </div>
      </div>

      {/* App Header (Myntra Styled) */}
      <div className="border-b border-neutral-100 px-4 py-3 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          {selectedProductId ? (
            <button 
              onClick={handleBackToGrid}
              className="p-1 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              id="buyer-app-back-btn"
            >
              <ArrowLeft className="w-6 h-6 text-neutral-700" />
            </button>
          ) : (
            <div className="p-1 text-myntra-pink font-display font-black text-lg select-none">M</div>
          )}
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block">Myntra Bazaar</span>
            <h1 className="font-display font-bold text-sm text-neutral-800 -mt-0.5">
              {selectedProductId ? "Product Detail" : "Bharat Originals"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-neutral-600 hover:text-myntra-pink cursor-pointer transition-colors" />
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-neutral-600" />
            <span className="absolute -top-1.5 -right-1.5 bg-myntra-pink text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              1
            </span>
          </div>
          <Share2 className="w-5 h-5 text-neutral-600 cursor-pointer" />
        </div>
      </div>

      {/* Main Container Scrollable */}
      <div className="h-[680px] overflow-y-auto pb-16 scrollbar-thin">
        <AnimatePresence mode="wait">
          {!selectedProductId ? (
            // SCREEN 1: PRODUCT CATALOG GRID
            <motion.div
              key="catalog-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 space-y-4"
              id="product-catalog-screen"
            >
              {/* Campaign Banner */}
              <div className="bg-myntra-gradient rounded-2xl p-4 text-white relative overflow-hidden shadow-sm">
                <div className="absolute right-0 bottom-0 opacity-15 translate-x-4 translate-y-4 scale-125">
                  <Sparkles className="w-24 h-24 text-white" />
                </div>
                <span className="text-[9px] bg-white/20 text-white font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Heritage Craft Week
                </span>
                <h3 className="text-base font-bold font-display mt-1.5">Borrowed Trust Collective</h3>
                <p className="text-[10px] text-neutral-100 leading-snug mt-1 max-w-[80%]">
                  Empowering rural weaver clusters with physical peer verification. Authenticated by gold-standard master mentors.
                </p>
              </div>

              {/* Grid Label */}
              <div>
                <h2 className="text-xs font-bold text-neutral-800 uppercase tracking-widest font-display">
                  Artisan Discoveries ({products.length})
                </h2>
                <p className="text-[10px] text-neutral-400 mt-0.5">Directly from the loom corridor</p>
              </div>

              {/* Two-Column Grid */}
              <div className="grid grid-cols-2 gap-3">
                {products.map((product) => {
                  const s = (sellers || []).find(sellerObj => sellerObj?.id === product?.sellerId || sellerObj?.name?.toLowerCase() === product?.sellerId?.toLowerCase());
                  const sellerIdVal = s?.id || product?.sellerId;
                  const prodOrders = ordersCount[sellerIdVal] !== undefined ? ordersCount[sellerIdVal] : (product?.sellerId === 'kunal-textiles' ? 4520 : 0);
                  const prodIsVouched = s?.status === 'Vouched';
                  const prodIsIndependent = prodIsVouched && prodOrders >= 50;

                  return (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className="bg-white border border-neutral-150 rounded-2xl p-2.5 flex flex-col justify-between hover:border-neutral-300 transition-all cursor-pointer shadow-xs group"
                      id={`product-card-${product.id}`}
                    >
                      <div>
                        {/* Interactive illustrative visual box */}
                        <div className="aspect-square bg-neutral-50 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-2 relative border border-neutral-100 group-hover:bg-neutral-100/50 transition-colors">
                          {renderProductImage(product)}
                          
                          {/* Absolute floating trust badge for transparency in grid */}
                          <div className="absolute top-1.5 left-1.5 z-10">
                            {prodIsIndependent ? (
                              <span className="text-[8px] bg-emerald-100/95 border border-emerald-300 text-emerald-900 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 backdrop-blur-xs shadow-2xs">
                                <Star className="w-2 h-2 text-amber-500 fill-amber-500" />
                                <span>⭐ Established</span>
                              </span>
                            ) : prodIsVouched ? (
                              <span className="text-[8px] bg-emerald-50/95 border border-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 backdrop-blur-xs shadow-2xs">
                                <Sparkles className="w-2 h-2 text-amber-500 fill-amber-500" />
                                <span>🤝 Peer-Vouched</span>
                              </span>
                            ) : (
                              <span className="text-[8px] bg-neutral-100/95 border border-neutral-200 text-neutral-600 font-bold px-1.5 py-0.5 rounded-full backdrop-blur-xs">
                                ⚠️ New
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Seller Name Micro line */}
                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">
                          {((sellers || []).find(sellerObj => sellerObj?.id === product?.sellerId || sellerObj?.name?.toLowerCase() === product?.sellerId?.toLowerCase())?.name) || "Artisan"}
                        </span>
                        
                        {/* Product Title */}
                        <h4 className="text-xs font-semibold text-neutral-800 line-clamp-1 group-hover:text-myntra-pink transition-colors mt-0.5">
                          {product.name}
                        </h4>
                      </div>

                      {/* Pricing Footer */}
                      <div className="mt-2 flex items-baseline justify-between flex-wrap gap-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-bold text-neutral-900">₹{product.price}</span>
                          <span className="text-[9px] text-neutral-400 line-through">₹{product.originalPrice}</span>
                        </div>
                        <span className="text-[8px] font-bold text-myntra-orange bg-myntra-orange/5 px-1 rounded">
                          {product.discount}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            // SCREEN 2: PRODUCT DETAIL PAGE (PDP)
            renderProductDetailPage()
          )}
        </AnimatePresence>
      </div>

      {/* INTERACTIVE TRUST PROOF MODAL */}
      <AnimatePresence>
        {showVouchModal && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50" id="trust-vouch-modal">
            <div className="absolute inset-0" onClick={() => setShowVouchModal(false)}></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl w-full max-w-xs p-5 shadow-2xl relative z-10 border border-neutral-100 space-y-4"
            >
              {/* Header & Close (X) button */}
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Mentor Guarantee</span>
                </div>
                <button 
                  onClick={() => setShowVouchModal(false)}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
                  id="close-vouch-modal-x-btn"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mentor Store Details */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-myntra-pink to-myntra-orange text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    KT
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 font-display">Kunal Textiles (Secunderabad)</h3>
                    <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                      4.8 ★ | 4,500+ Lifetime Orders
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-neutral-700 leading-relaxed pt-2 border-t border-emerald-200/60">
                  <strong>Legitimacy Guarantee Note:</strong>
                  <p className="italic text-neutral-800 mt-0.5">
                    "Kunal Textiles has validated the real-world business existence and local identity of this seller."
                  </p>
                </div>
              </div>

              {/* Audit Verification List */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Verified Audits</h4>
                <div className="space-y-1.5 text-[11px] text-neutral-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Physical workshop location verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Fair artisan wages certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Fabric weaving quality audited</span>
                  </div>
                </div>
              </div>

              {/* Close button */}
              <button 
                onClick={() => setShowVouchModal(false)}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold py-2.5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                id="close-vouch-modal-btn"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
