import React, { useState } from 'react';
import { useAcademy } from '../context/AcademyContext';
import { ShopProduct, ShopOrderItem } from '../types';
import { uploadFile } from '../lib/firebase';
import { 
  ShoppingBag, ShoppingCart, Plus, Minus, Trash2, X, CheckCircle, 
  Landmark, ShieldCheck, ArrowRight, Upload, Phone, Mail, MapPin, 
  Search, Sparkles, AlertCircle, FileImage, CreditCard, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ShopCatalog() {
  const { shopProducts, websiteData, createShopOrder, setView } = useAcademy();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart state
  const [cart, setCart] = useState<{ product: ShopProduct; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'EasyPaisa' | 'Bank Transfer'>('JazzCash');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptBase64, setReceiptBase64] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categories = ['All', 'Uniforms', 'Tools & Cutlery', 'Bakery Gear', 'Barista Gear', 'Books & Courses'];

  // Filter products
  const filteredProducts = shopProducts.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Cart operations
  const addToCart = (product: ShopProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // File compression for receipt photo
  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setReceiptBase64(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Submit Order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) {
      setErrorMessage('Please fill in your Name, Phone Number, and Delivery Address.');
      return;
    }
    if (cart.length === 0) {
      setErrorMessage('Your shopping cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let downloadUrl = '';
      if (receiptBase64) {
        downloadUrl = await uploadFile(receiptBase64, `shop-receipt-${Date.now()}.jpg`);
      }

      const orderItems: ShopOrderItem[] = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      }));

      const newOrder = createShopOrder({
        customerName,
        phone,
        email,
        address,
        items: orderItems,
        totalAmount: totalCartAmount,
        paymentMethod,
        transactionRef,
        receiptFile: downloadUrl || undefined
      });

      setOrderSuccess(newOrder);
      setCart([]);
      setIsCheckoutOpen(false);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Failed to submit order:', err);
      setIsSubmitting(false);
      setErrorMessage('Failed to submit your order. Please try again or contact support.');
    }
  };

  const pSettings = websiteData?.paymentSettings || {
    easypaisaTitle: 'The Chefs Academy Lahore',
    easypaisaNumber: '0333-9123456',
    bankName: 'Bank Alfalah',
    bankTitle: 'The Chefs Academy (Pvt) Ltd',
    bankIban: 'PK64ALFH00921008472910',
    instructions: 'Transfer the total order amount to our JazzCash / EasyPaisa or Bank Alfalah account and enter your transaction TRX ID above.'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Background Glow */}
      <div className="fixed top-1/4 left-1/2 w-96 h-96 bg-[#c19d53]/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative">

        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#c19d53]/10 border border-[#c19d53]/20 text-[#c19d53] text-xs font-semibold uppercase tracking-widest">
            <ShoppingBag className="h-4 w-4" />
            <span>TCA Official Store & Gear</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Professional Culinary Gear & Uniforms
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Equip yourself with certified chef jackets, German steel knife rolls, bakery decorating kits, and official academy course literature.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl backdrop-blur flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#c19d53] text-slate-950 shadow-md shadow-[#c19d53]/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search gear, knives, aprons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#c19d53]"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
            <ShoppingBag className="h-12 w-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-serif font-bold text-slate-300">No products found</h3>
            <p className="text-xs text-slate-500">Try adjusting your category filter or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-[#c19d53]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                    <img 
                      src={product.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800'} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-slate-950/80 backdrop-blur border border-slate-700 text-[#c19d53] text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                    {product.inStock ? (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold rounded-lg flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> In Stock
                        </span>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 bg-rose-950/90 border border-rose-500/30 text-rose-400 text-[10px] font-semibold rounded-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#c19d53] transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action & Price */}
                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80 mt-2 pt-4">
                  <div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Price</div>
                    <div className="text-xl font-serif font-bold text-[#c19d53]">
                      PKR {product.price.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer ${
                      product.inStock 
                        ? 'bg-[#c19d53] text-slate-950 hover:brightness-110 shadow-lg shadow-[#c19d53]/15'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="h-4 w-4 stroke-[3]" />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Floating Cart Button */}
      {totalCartCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#c19d53] text-slate-950 p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-3 border-2 border-slate-950 cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6 stroke-[2.5]" />
            <span className="absolute -top-2 -right-2 bg-slate-950 text-[#c19d53] font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-[#c19d53]">
              {totalCartCount}
            </span>
          </div>
          <span className="font-serif font-bold text-sm hidden sm:inline">
            PKR {totalCartAmount.toLocaleString()}
          </span>
        </button>
      )}

      {/* Slide-over Shopping Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-[#c19d53]" />
                    <h2 className="font-serif text-lg font-bold text-white">Your Shopping Cart</h2>
                    <span className="text-xs text-slate-400">({totalCartCount} items)</span>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)} 
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow"
                    title="Close Cart"
                  >
                    <X className="h-4 w-4 stroke-[2.5]" />
                    <span className="text-xs font-bold uppercase">Close</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="p-5 flex-1 overflow-y-auto space-y-4 scrollbar-thin">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <ShoppingBag className="h-10 w-10 text-slate-600 mx-auto" />
                      <p className="text-sm text-slate-400">Your cart is empty.</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.product.id} className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl flex gap-3">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-16 h-16 object-cover rounded-lg bg-slate-900"
                        />
                        <div className="flex-1 space-y-1">
                          <h4 className="text-xs font-bold text-white line-clamp-1">{item.product.name}</h4>
                          <div className="text-xs text-[#c19d53] font-bold">
                            PKR {item.product.price.toLocaleString()}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5">
                              <button 
                                onClick={() => updateQuantity(item.product.id, -1)}
                                className="text-slate-400 hover:text-white"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-xs font-bold text-white px-1">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, 1)}
                                className="text-slate-400 hover:text-white"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-slate-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Subtotal & Checkout */}
                {cart.length > 0 && (
                  <div className="p-5 border-t border-slate-800 bg-slate-950/90 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Subtotal Amount</span>
                      <span className="font-serif font-bold text-lg text-[#c19d53]">
                        PKR {totalCartAmount.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full bg-[#c19d53] text-slate-950 font-bold py-3.5 rounded-xl uppercase tracking-wider text-xs hover:brightness-110 shadow-lg shadow-[#c19d53]/15 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden my-8"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-[#c19d53]" />
                  <h2 className="font-serif text-lg font-bold text-white">Checkout & JazzCash / Bank Payment</h2>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)} 
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                  title="Close Checkout Modal"
                >
                  <X className="h-4 w-4 stroke-[2.5]" />
                  <span className="text-xs font-bold uppercase">Close</span>
                </button>
              </div>

              <form onSubmit={handlePlaceOrder} className="p-6 space-y-6">
                
                {errorMessage && (
                  <div className="p-3 bg-rose-950/80 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#c19d53]">1. Customer & Shipping Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name *</label>
                      <input 
                        type="text" 
                        required
                        value={customerName} 
                        onChange={e => setCustomerName(e.target.value)} 
                        placeholder="e.g. Chef Ahmed Khan"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:border-[#c19d53] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone / WhatsApp *</label>
                      <input 
                        type="text" 
                        required
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                        placeholder="03001234567"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:border-[#c19d53] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="student@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:border-[#c19d53] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Delivery Address *</label>
                    <textarea 
                      rows={2}
                      required
                      value={address} 
                      onChange={e => setAddress(e.target.value)} 
                      placeholder="House #, Street, Sector/Area, City (e.g. Gulberg III, Lahore)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:border-[#c19d53] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#c19d53]">2. Payment Method & Instructions</h3>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {(['JazzCash', 'EasyPaisa', 'Bank Transfer'] as const).map(method => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 rounded-xl border text-center transition-all text-xs font-bold cursor-pointer ${
                          paymentMethod === method
                            ? 'bg-[#c19d53]/15 border-[#c19d53] text-[#c19d53]'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>

                  {/* Payment Details Box */}
                  <div className="bg-slate-950 border border-[#c19d53]/30 p-4 rounded-xl space-y-3 text-xs">
                    {paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa' ? (
                      <div className="space-y-1.5">
                        <div className="text-slate-400">Account Title: <span className="text-white font-bold">{pSettings.easypaisaTitle}</span></div>
                        <div className="text-slate-400">{paymentMethod} Mobile Number: <span className="text-[#c19d53] font-bold text-sm">{pSettings.easypaisaNumber}</span></div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="text-slate-400">Bank Name: <span className="text-white font-bold">{pSettings.bankName}</span></div>
                        <div className="text-slate-400">Account Title: <span className="text-white font-bold">{pSettings.bankTitle}</span></div>
                        <div className="text-slate-400">Account IBAN #: <span className="text-[#c19d53] font-bold">{pSettings.bankIban}</span></div>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
                      Please transfer <strong className="text-white">PKR {totalCartAmount.toLocaleString()}</strong> to the account above and enter your TRX transaction reference below.
                    </p>
                  </div>

                  {/* TRX Reference & Receipt Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Transaction TRX ID / Ref #</label>
                      <input 
                        type="text" 
                        value={transactionRef} 
                        onChange={e => setTransactionRef(e.target.value)} 
                        placeholder="e.g. TRX-9823471"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:border-[#c19d53] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Payment Receipt Photo (Optional)</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleReceiptFileChange}
                        className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#c19d53] file:text-slate-950 hover:file:brightness-110 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary & Submit / Cancel Buttons */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Payable</div>
                    <div className="text-xl font-serif font-bold text-[#c19d53]">PKR {totalCartAmount.toLocaleString()}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCheckoutOpen(false)}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl uppercase tracking-wider text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel / Close
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#c19d53] text-slate-950 font-bold px-6 py-3 rounded-xl uppercase tracking-wider text-xs hover:brightness-110 shadow-lg shadow-[#c19d53]/15 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Placing Order...</span>
                      ) : (
                        <>
                          <span>Place Order Now</span>
                          <CheckCircle className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Success Modal */}
      <AnimatePresence>
        {orderSuccess && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-[#c19d53]/40 max-w-md w-full rounded-2xl p-6 shadow-2xl text-center space-y-5 relative"
            >
              <button 
                type="button"
                onClick={() => setOrderSuccess(null)} 
                className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full border border-slate-700 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
              <div className="w-14 h-14 bg-[#c19d53]/10 border border-[#c19d53]/30 rounded-full flex items-center justify-center mx-auto text-[#c19d53]">
                <CheckCircle className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl font-bold text-white">Order Submitted Successfully!</h3>
                <p className="text-xs text-slate-400">
                  Thank you <strong className="text-white">{orderSuccess.customerName}</strong>! Your shop order has been received.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-xs text-left">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Order Reference #:</span>
                  <span className="text-[#c19d53] font-bold">{orderSuccess.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="text-white font-bold">PKR {orderSuccess.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="text-amber-400 font-bold">Pending Verification</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Our team will verify your payment and contact you on WhatsApp/Phone (<strong className="text-slate-200">{orderSuccess.phone}</strong>) before dispatching your item.
              </p>

              <button
                onClick={() => setOrderSuccess(null)}
                className="w-full bg-[#c19d53] text-slate-950 font-bold py-3 rounded-xl uppercase tracking-wider text-xs hover:brightness-110 transition-all cursor-pointer"
              >
                Back to Shop Catalog
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
