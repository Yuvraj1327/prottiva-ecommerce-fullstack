
//claude
import { useState, useEffect, useRef } from "react";
import api from "./api";       // axios instance — baseURL = VITE_STORE_API

// ════════════════════════════════════════════════════════════
//  API CONFIG
//  VITE_STORE_API   = backend URL (ecommerce + skin analysis + glowup)
//  VITE_CLAUDE_KEY  = Anthropic key (ONLY for Live Chat widget)
// ════════════════════════════════════════════════════════════
// baseURL ab api.js se aata hai (VITE_STORE_API)
// GLOWUP same backend pe hai
const CLAUDE_KEY  = import.meta.env.VITE_CLAUDE_KEY || "";  // live chat only

// ════════════════════════════════════════════════════════════
//  GOOGLE FONTS + CSS ANIMATIONS
// ════════════════════════════════════════════════════════════
if (!document.getElementById("prottiva-fonts")) {
  const l = document.createElement("link");
  l.id = "prottiva-fonts"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
  document.head.appendChild(l);
}
if (!document.getElementById("prottiva-styles")) {
  const s = document.createElement("style");
  s.id = "prottiva-styles";
  s.textContent = `
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes spinR{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes pulse2{0%,100%{opacity:.5}50%{opacity:1}}
    @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes bounceIn{0%{transform:scale(.8);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    .fu{animation:fadeUp .5s ease both}
    .fi{animation:fadeIn .4s ease both}
    .fl{animation:floatY 3.5s ease-in-out infinite}
    .sp{animation:spinR 1.2s linear infinite}
    .pu{animation:pulse2 2.5s ease-in-out infinite}
    .si{animation:slideIn .35s ease both}
    .bi{animation:bounceIn .4s ease both}
    .d1{animation-delay:.08s}.d2{animation-delay:.16s}.d3{animation-delay:.24s}.d4{animation-delay:.32s}.d5{animation-delay:.4s}
    .shimmer{background:linear-gradient(90deg,#f0fdf4 25%,#d1fae5 50%,#f0fdf4 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
    .card-hover{transition:all .25s ease}
    .card-hover:hover{transform:translateY(-4px);box-shadow:0 20px 40px -8px rgba(5,150,105,.15)}
    .scrollbar-hide::-webkit-scrollbar{display:none}
    .glass{background:rgba(255,255,255,.85);backdrop-filter:blur(16px)}
    .glow-border{border:2px solid transparent;background-clip:padding-box}
    /* Glow-up comparison slider */
    .compare-wrapper{position:relative;overflow:hidden;border-radius:1.5rem;cursor:ew-resize;user-select:none}
    .compare-after{position:absolute;inset:0;overflow:hidden}
    .compare-handle{position:absolute;top:0;bottom:0;width:3px;background:white;cursor:ew-resize;z-index:10}
    .compare-handle::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:32px;height:32px;background:white;border-radius:50%;box-shadow:0 2px 12px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center}
  `;
  document.head.appendChild(s);
}

// ════════════════════════════════════════════════════════════
//  SKIN QUIZ QUESTIONS
// ════════════════════════════════════════════════════════════
const SKIN_Q = [
  {id:"type",    q:"How does your skin feel by midday?",             opts:["Very oily / shiny","Dry and tight","Oily T-zone only","Comfortable & balanced","Sensitive & reactive"]},
  {id:"concern", q:"What is your #1 skin concern right now?",        opts:["Acne / breakouts","Dryness / dehydration","Dark spots / uneven tone","Fine lines / wrinkles","Redness / sensitivity"]},
  {id:"texture", q:"How is your skin texture?",                      opts:["Rough & bumpy","Smooth overall","Large / visible pores","Flaky patches","Uneven / scarred"]},
  {id:"sun",     q:"Daily sun exposure?",                            opts:["Mostly indoors","1-2 hrs","2-4 hrs","More than 4 hrs","Varies"]},
  {id:"routine", q:"What is your current skincare routine?",         opts:["Nothing / very basic","Cleanser + moisturiser","3-4 step routine","Full AM/PM routine","I try many products"]},
];
const CATS = ["All","Serum","Moisturiser","Sunscreen","Treatment","Eye Care","Toner","Mask"];

// ════════════════════════════════════════════════════════════
//  SMALL HELPERS
// ════════════════════════════════════════════════════════════
function Stars({ r = 5, sm = false }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} viewBox="0 0 20 20" className={`${sm?"w-3 h-3":"w-4 h-4"} ${s<=Math.round(r)?"text-amber-400":"text-slate-200"}`} fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  );
}

function Chip({ text, color="green" }) {
  const c = {green:"bg-emerald-100 text-emerald-700",teal:"bg-teal-100 text-teal-700",amber:"bg-amber-100 text-amber-700",rose:"bg-rose-100 text-rose-600",blue:"bg-sky-100 text-sky-600",purple:"bg-purple-100 text-purple-600"}[color]||"bg-emerald-100 text-emerald-700";
  return <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${c}`}>{text}</span>;
}

function Inp({ label, name, type="text", value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{label}</label>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"/>
    </div>
  );
}

function Spinner({ sm }) {
  return <span className={`${sm?"w-4 h-4":"w-6 h-6"} border-2 border-emerald-200 border-t-emerald-600 rounded-full sp inline-block`}/>;
}

function Logo({ h=36 }) {
  return <img src="/logo.png" alt="Prottiva Nutrition" style={{height:h,objectFit:"contain"}}/>;
}

// ════════════════════════════════════════════════════════════
//  NAVBAR
// ════════════════════════════════════════════════════════════
function Navbar({ page, setPage, cart, wishlist, user, setAuthModal }) {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const cartCount = cart.reduce((a,i) => a+i.qty, 0);

  useEffect(() => {
    const h = () => setScroll(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    api.get("/products").then(r => setAllProducts(r.data.products||[])).catch(()=>{});
  }, []);

  const filtered = search.length > 1
    ? allProducts.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.cat?.toLowerCase().includes(search.toLowerCase()))
    : [];

  const navLinks = ["Home","Shop","Skin Test","Glow-Up","About","Contact"];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scroll?"bg-white shadow-md":"glass"} border-b border-emerald-100/60`}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4">
        <button onClick={() => setPage("Home")} className="flex-shrink-0"><Logo h={40}/></button>

        <ul className="hidden lg:flex items-center gap-5 flex-1 justify-center">
          {navLinks.map(l => (
            <li key={l}>
              <button onClick={() => setPage(l)}
                className={`text-sm font-medium transition-all px-1 pb-0.5 ${page===l?"text-emerald-600 border-b-2 border-emerald-500":"text-slate-600 hover:text-emerald-600"}`}>
                {l==="Skin Test" ? <span className="flex items-center gap-1.5">🔬{l}<span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">AI</span></span>
                  : l==="Glow-Up" ? <span className="flex items-center gap-1.5">✨{l}<span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-bold">NEW</span></span>
                  : l}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 ml-auto">
          {/* Search */}
          <div className="relative hidden md:block">
            <input value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchOpen(true)} onBlur={() => setTimeout(()=>setSearchOpen(false),200)}
              placeholder="Search products…"
              className="w-40 focus:w-52 transition-all border border-slate-200 rounded-full px-4 py-1.5 text-xs focus:outline-none focus:border-emerald-400 bg-slate-50"/>
            {searchOpen && filtered.length > 0 && (
              <div className="absolute top-9 left-0 w-64 bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden z-50">
                {filtered.slice(0,6).map(p => (
                  <button key={p.id} onMouseDown={() => {setPage("Shop");setSearch("");}}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-left">
                    {p.image_url
                      ? <img src={p.image_url} className="w-8 h-8 object-cover rounded-lg" alt=""/>
                      : <span className="text-2xl">{p.emoji||"🧴"}</span>}
                    <div><p className="text-sm font-medium text-slate-800">{p.name}</p><p className="text-xs text-emerald-600">₹{p.price}</p></div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={() => setPage("Wishlist")} className="relative w-9 h-9 rounded-full hover:bg-rose-50 flex items-center justify-center text-lg">
            🤍
            {wishlist.length>0 && <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
          </button>

          {/* Cart */}
          <button onClick={() => setPage("Cart")} className="relative w-9 h-9 rounded-full hover:bg-emerald-50 flex items-center justify-center text-lg">
            🛒
            {cartCount>0 && <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>

          {/* Auth */}
          {user ? (
            <button className="hidden md:flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">{user[0].toUpperCase()}</span>
              {user.split(" ")[0]}
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setAuthModal("login")} className="text-xs font-medium text-slate-600 hover:text-emerald-600 px-3 py-1.5">Log in</button>
              <button onClick={() => setAuthModal("signup")} className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-full transition-all active:scale-95">Sign up</button>
            </div>
          )}
          <button className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-600" onClick={() => setOpen(!open)}>{open?"✕":"☰"}</button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-emerald-50 px-5 py-4 flex flex-col gap-3">
          {navLinks.map(l => (
            <button key={l} onClick={() => {setPage(l);setOpen(false);}} className={`text-left text-sm font-medium py-1 ${page===l?"text-emerald-600":"text-slate-600"}`}>{l}</button>
          ))}
          {["Cart","Wishlist"].map(l => (
            <button key={l} onClick={() => {setPage(l);setOpen(false);}} className="text-left text-sm font-medium py-1 text-slate-600">{l}</button>
          ))}
          {!user && (
            <div className="flex gap-3 pt-2 border-t border-emerald-50">
              <button onClick={() => {setAuthModal("login");setOpen(false);}} className="text-sm font-medium text-slate-600 px-4 py-2 border border-slate-200 rounded-full">Log in</button>
              <button onClick={() => {setAuthModal("signup");setOpen(false);}} className="text-sm font-semibold bg-emerald-600 text-white px-4 py-2 rounded-full">Sign up</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

// ════════════════════════════════════════════════════════════
//  AUTH MODAL
// ════════════════════════════════════════════════════════════
function AuthModal({ mode, onClose, onAuth }) {
  const [tab, setTab] = useState(mode);
  const [f, setF] = useState({name:"",email:"",password:""});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function ch(e) { setF(x => ({...x,[e.target.name]:e.target.value})); setErr(""); }

  async function sub(e) {
    e.preventDefault();
    if (!f.email||!f.password) { setErr("Please fill all fields."); return; }
    if (tab==="signup"&&!f.name) { setErr("Name is required."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r,900));
    setLoading(false);
    onAuth(f.name||f.email.split("@")[0]);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{backgroundColor:"rgba(0,0,0,.5)",backdropFilter:"blur(8px)"}}
      onClick={e => e.target===e.currentTarget&&onClose()}>
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden bi">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-7 flex flex-col items-center">
          <Logo h={44}/>
          <p className="text-emerald-100 text-xs mt-2">Science-backed skincare nutrition</p>
        </div>
        <div className="p-6">
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-5">
            {["login","signup"].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 text-sm font-semibold py-1.5 rounded-xl transition-all ${tab===t?"bg-white shadow text-emerald-700":"text-slate-400"}`}>
                {t==="login"?"Log In":"Sign Up"}
              </button>
            ))}
          </div>
          <form onSubmit={sub} className="flex flex-col gap-3">
            {tab==="signup" && <Inp label="Full Name" name="name" value={f.name} onChange={ch} placeholder="Anika Sharma"/>}
            <Inp label="Email" name="email" type="email" value={f.email} onChange={ch} placeholder="you@email.com"/>
            <Inp label="Password" name="password" type="password" value={f.password} onChange={ch} placeholder="••••••••"/>
            {err && <p className="text-rose-500 text-xs bg-rose-50 px-3 py-2 rounded-lg">{err}</p>}
            <button type="submit" disabled={loading} className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
              {loading && <Spinner sm/>}
              {loading?"Please wait…":tab==="login"?"Log In →":"Create Account →"}
            </button>
          </form>
          <button onClick={onClose} className="w-full mt-3 text-slate-400 hover:text-slate-600 text-xs py-2 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  PRODUCT CARD
// ════════════════════════════════════════════════════════════
function ProductCard({ p, onBuy, onWishlist, wishlisted }) {
  const price   = p.price  || 0;
  const mrp     = p.mrp    || 0;
  const rating  = p.rating || 5;
  const reviews = p.rev    || 0;
  const disc    = mrp > price ? Math.round((1 - price/mrp)*100) : 0;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-emerald-100/80 card-hover group flex flex-col">
      <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 h-44 flex items-center justify-center overflow-hidden">
        {p.image_url
          ? <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"/>
          : <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{p.emoji||"🧴"}</span>}
        <span className="absolute top-3 left-3"><Chip text={p.tag||"New"} color="green"/></span>
        {disc>0 && <span className="absolute top-3 right-10 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{disc}% OFF</span>}
        <button onClick={() => onWishlist(p)}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-base transition-all hover:scale-110 ${wishlisted?"text-rose-500":"text-slate-300 hover:text-rose-400"}`}>
          {wishlisted?"❤️":"🤍"}
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Chip text={p.cat||"Skincare"} color="teal"/>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="font-bold text-emerald-950 text-lg leading-snug">{p.name}</h3>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 flex-1">{p.description||p.desc||"Prottiva Nutrition"}</p>
        <div className="flex items-center gap-2"><Stars r={rating} sm/><span className="text-xs text-slate-400">({reviews.toLocaleString()})</span></div>
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100">
          <div>
            <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-800">₹{price.toLocaleString()}</span>
            {mrp>price && <span className="text-xs text-slate-400 line-through ml-1.5">₹{mrp.toLocaleString()}</span>}
          </div>
          <button onClick={() => onBuy(p)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all hover:shadow-lg active:scale-95">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  PRODUCT MODAL
// ════════════════════════════════════════════════════════════
function ProductModal({ p, onClose, onAddToCart, onWishlist, wishlisted }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const price  = p.price  || 0;
  const mrp    = p.mrp    || 0;
  const rating = p.rating || 5;
  const reviews= p.rev    || 0;
  const disc   = mrp>price ? Math.round((1-price/mrp)*100) : 0;

  function add() { onAddToCart(p,qty); setAdded(true); setTimeout(()=>setAdded(false),2000); }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{backgroundColor:"rgba(0,0,0,.55)",backdropFilter:"blur(8px)"}}
      onClick={e => e.target===e.currentTarget&&onClose()}>
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden bi max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 flex gap-5 items-start relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/60 text-xl">✕</button>
          <div className="w-28 h-28 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0 fl">
            {p.image_url
              ? <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-2"/>
              : <span className="text-6xl">{p.emoji||"🧴"}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-2">
              <Chip text={p.tag||"New"} color="green"/>
              <Chip text={p.cat||"Skincare"} color="teal"/>
              {disc>0 && <Chip text={disc+"% OFF"} color="amber"/>}
            </div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-950 leading-tight">{p.name}</h2>
            <p className="text-slate-400 text-xs mt-1">{p.ml||p.volume||""} · Prottiva Nutrition</p>
            <div className="flex items-center gap-2 mt-2">
              <Stars r={rating}/><span className="text-xs text-slate-500">{rating} · {reviews.toLocaleString()} reviews</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col md:flex-row gap-5 overflow-y-auto scrollbar-hide">
          <div className="flex-1 flex flex-col gap-3">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">About</p>
              <p className="text-sm text-slate-600 leading-relaxed">{p.detail||p.description||p.desc||"Premium Prottiva Nutrition formula."}</p>
            </div>
            {(p.ingredients||p.key_ingredients) && (
              <div className="bg-emerald-50 rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">Key Ingredients</p>
                <p className="text-sm text-slate-600">{p.ingredients||p.key_ingredients}</p>
              </div>
            )}
            <button onClick={() => onWishlist(p)}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-all w-fit ${wishlisted?"border-rose-300 text-rose-500 bg-rose-50":"border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-400"}`}>
              {wishlisted?"❤️ Wishlisted":"🤍 Add to Wishlist"}
            </button>
          </div>

          <div className="md:w-44 flex flex-col gap-3 flex-shrink-0">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl font-bold text-emerald-800">₹{price.toLocaleString()}</span>
                {mrp>price && <span className="text-xs text-slate-400 line-through">₹{mrp.toLocaleString()}</span>}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">✓ Free delivery on ₹999+</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Qty</p>
              <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-3 py-2 w-fit">
                <button onClick={() => setQty(Math.max(1,qty-1))} className="w-7 h-7 rounded-full bg-white shadow text-slate-600 hover:text-emerald-600 font-bold flex items-center justify-center">−</button>
                <span className="font-semibold w-4 text-center text-sm">{qty}</span>
                <button onClick={() => setQty(qty+1)} className="w-7 h-7 rounded-full bg-white shadow text-slate-600 hover:text-emerald-600 font-bold flex items-center justify-center">+</button>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-3">
              <p className="text-xs text-emerald-400 uppercase">Total</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-700">₹{(price*qty).toLocaleString()}</p>
            </div>
            <button onClick={add} className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95 ${added?"bg-green-500 text-white":"bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:-translate-y-0.5"}`}>
              {added?"✓ Added!":"🛒 Add to Cart"}
            </button>
            <button onClick={onClose} className="w-full py-2.5 rounded-2xl text-xs text-slate-500 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  AI SKIN TEST PAGE  (Replicate nano-banana via Backend)
// ════════════════════════════════════════════════════════════
//
//  Flow:
//    Quiz answers + optional selfie
//      → POST /skin-analysis  (backend)
//        → Replicate nano-banana (text + vision)
//          → JSON skin report
//              → Results + product recommendations
//
function SkinTestPage({ onBuy, products }) {
  const [step,       setStep]       = useState(0);
  const [answers,    setAnswers]    = useState({});
  const [imgData,    setImgData]    = useState(null);   // base64 string (no prefix)
  const [imgPreview, setImgPreview] = useState(null);   // object URL for <img>
  const [imgMime,    setImgMime]    = useState("image/jpeg");
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [err,        setErr]        = useState("");
  const fileRef = useRef();

  // Loading message cycle so user knows backend is working
  const LOADING_MSGS = [
    "Sending skin data to AI…",
    "Analysing your skin type…",
    "Mapping concerns & ingredients…",
    "Building your routine…",
    "Almost done…",
  ];
  useEffect(() => {
    if (!loading) { setLoadingMsg(""); return; }
    let i = 0;
    setLoadingMsg(LOADING_MSGS[0]);
    const timer = setInterval(() => {
      i = (i + 1) % LOADING_MSGS.length;
      setLoadingMsg(LOADING_MSGS[i]);
    }, 3000);
    return () => clearInterval(timer);
  }, [loading]);

  function pick(id, val) { setAnswers(a => ({...a,[id]:val})); }

  function onFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErr("Photo too large — max 5 MB."); return; }
    setImgMime(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      setImgPreview(dataUrl);
      // Strip "data:image/...;base64," prefix — backend wants pure base64
      setImgData(dataUrl.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  async function analyse() {
    setLoading(true); setErr("");

    // Build answers dict with human-readable question labels
    const answersDict = {};
    SKIN_Q.forEach(q => {
      answersDict[q.q] = answers[q.id] || "Not answered";
    });

    // Payload for backend /skin-analysis
    const payload = {
      answers: answersDict,
      image_base64: imgData || null,
      image_mime:   imgData ? imgMime : null,
    };

    try {
      const res = await api.post("/skin-analysis", payload);
      setResult(res.data);
      setStep(7);
    } catch (e) {
      const detail = e.response?.data?.detail || e.message || "Please try again.";
      setErr("Analysis failed: " + detail);
    }
    setLoading(false);
  }

  const recP = result && products?.length
    ? products.filter(p => result.recommendedProductIds?.includes(p.id)).slice(0,3)
    : [];

  if (step===0) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-28 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full text-center fu">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl shadow-emerald-200 fl">🔬</div>
        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
          Powered by Replicate AI · nano-banana
        </span>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4 leading-tight">
          AI Skin Analysis<br/><span className="italic text-emerald-600">Personalised for you</span>
        </h1>
        <p className="text-slate-600 text-base leading-relaxed mb-8">
          Answer 5 quick questions + optionally upload a selfie. Our AI vision model analyses your skin profile and builds your personalised Prottiva routine.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[["⏱️","2 minutes"],["📸","Vision AI analysis"],["🎁","Free & personalised"]].map(([e,t]) => (
            <div key={t} className="bg-white rounded-2xl p-3 shadow-sm border border-emerald-100">
              <div className="text-2xl mb-1">{e}</div><p className="text-xs font-medium text-slate-600">{t}</p>
            </div>
          ))}
        </div>
        <button onClick={()=>setStep(1)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base px-10 py-4 rounded-full shadow-xl shadow-emerald-200 hover:-translate-y-0.5 transition-all active:scale-95">
          Start Free Skin Test →
        </button>
      </div>
    </div>
  );

  if (step>=1 && step<=5) {
    const q = SKIN_Q[step-1];
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full fu">
          <div className="mb-8">
            <div className="flex justify-between text-xs text-slate-400 font-medium mb-2"><span>Question {step} of 5</span><span>{Math.round((step/5)*100)}%</span></div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500" style={{width:(step/5*100)+"%"}}/>
            </div>
          </div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl md:text-3xl font-bold text-emerald-950 mb-6">{q.q}</h2>
          <div className="flex flex-col gap-3">
            {q.opts.map(o => (
              <button key={o} onClick={()=>pick(q.id,o)}
                className={`text-left px-5 py-4 rounded-2xl border-2 text-sm font-medium transition-all ${answers[q.id]===o?"border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm":"border-slate-200 bg-white text-slate-700 hover:border-emerald-300"}`}>
                {answers[q.id]===o?"✓ ":""}{o}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-8">
            {step>1 && <button onClick={()=>setStep(s=>s-1)} className="px-6 py-3 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:border-emerald-300">← Back</button>}
            <button disabled={!answers[q.id]} onClick={()=>setStep(s=>s+1)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-full transition-all disabled:opacity-40 active:scale-95">
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step===6) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white pt-28 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full fu">
        <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl font-bold text-emerald-950 mb-2 text-center">
          Upload a Selfie <span className="italic text-emerald-600">(Optional)</span>
        </h2>
        <p className="text-slate-500 text-sm text-center mb-8">Our AI analyses your actual skin for a more accurate report. Your photo is never stored.</p>

        <div onClick={()=>fileRef.current.click()}
          className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all mb-6 ${imgPreview?"border-emerald-400 bg-emerald-50":"border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50"}`}>
          {imgPreview ? (
            <div className="flex flex-col items-center gap-3">
              <img src={imgPreview} alt="preview" className="w-40 h-40 object-cover rounded-2xl shadow-lg"/>
              <p className="text-emerald-600 font-semibold text-sm">✓ Photo ready — AI will analyse this</p>
              <button onClick={e=>{e.stopPropagation();setImgPreview(null);setImgData(null);}} className="text-xs text-rose-400 hover:text-rose-600 underline">Remove</button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-4xl">📸</div>
              <p className="font-medium text-slate-600">Tap to upload selfie or skin close-up</p>
              <p className="text-xs">JPG, PNG · Max 5 MB · Front-facing recommended</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile}/>
        </div>

        {err && <p className="text-rose-500 text-sm bg-rose-50 px-4 py-3 rounded-2xl mb-4 text-center">{err}</p>}
        <div className="flex gap-3">
          <button onClick={()=>setStep(5)} className="px-6 py-3 rounded-full border border-slate-200 text-slate-600 text-sm font-medium">← Back</button>
          <button onClick={analyse} disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-full disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-emerald-200">
            {loading
              ? <><Spinner sm/><span className="text-sm">{loadingMsg || "Analysing…"}</span></>
              : imgData ? "🔬 Analyse Skin + Photo" : "🔬 Analyse My Skin"}
          </button>
        </div>
        {!loading && (
          <button onClick={analyse} disabled={loading} className="w-full text-center text-xs text-emerald-600 hover:underline mt-3 disabled:opacity-40">
            {imgData ? "Skip photo & use quiz answers only →" : "Analyse without photo →"}
          </button>
        )}
        {loading && (
          <div className="mt-5 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <p className="text-xs text-emerald-600 font-semibold text-center mb-2">⏳ AI is working — this may take 30–90 seconds</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {["Reading quiz","Analysing skin type","Checking concerns","Selecting ingredients","Building routine"].map((t,i) => (
                <span key={t} style={{animationDelay:i*0.3+"s"}} className="text-xs bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full font-medium pu">{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (step===7 && result) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Score card */}
        <div className="bg-gradient-to-br from-emerald-700 to-teal-700 rounded-3xl p-7 text-white mb-7 fu relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5"/>
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5"/>
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-24 h-24 rounded-full bg-white/20 flex flex-col items-center justify-center flex-shrink-0 border-2 border-white/30">
              <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl font-bold leading-none">{result.skinScore}</span>
              <span className="text-emerald-200 text-xs">/100</span>
            </div>
            <div>
              <Chip text={"Skin Type: "+result.skinType} color="teal"/>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl md:text-3xl font-bold mt-2 mb-1">{result.headline}</h2>
              {result.imageObservation && <p className="text-emerald-100 text-sm bg-white/10 px-3 py-1.5 rounded-full inline-block mb-1">📸 {result.imageObservation}</p>}
              <p className="text-emerald-200 text-sm mt-1">💡 {result.lifestyleTip}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 fu d1">
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-900 mb-4">🎯 Top Concerns</h3>
            {result.topConcerns?.map(c => (
              <div key={c} className="flex items-center gap-2.5 text-sm text-slate-700 bg-rose-50 px-4 py-2.5 rounded-xl mb-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0"/>{c}
              </div>
            ))}
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 fu d2">
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-900 mb-4">🌿 Ingredient Guide</h3>
            <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold mb-2">Seek these:</p>
            <div className="flex flex-wrap gap-1.5 mb-3">{result.ingredientsToSeek?.map(i => <span key={i} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">{i}</span>)}</div>
            <p className="text-[10px] uppercase tracking-widest text-rose-500 font-bold mb-2">Avoid these:</p>
            <div className="flex flex-wrap gap-1.5">{result.ingredientsToAvoid?.map(i => <span key={i} className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full font-medium">{i}</span>)}</div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 fu d3 md:col-span-2">
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-900 mb-4">📋 Your Personalised Routine</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[["☀️ Morning",result.routine?.morning||[]],["🌙 Evening",result.routine?.evening||[]]].map(([t,steps]) => (
                <div key={t} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4">
                  <p className="font-semibold text-emerald-800 mb-3 text-sm">{t}</p>
                  {steps.map((s,i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700 mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>{s}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {recP.length>0 && (
          <div className="fu d4">
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-900 mb-5">✨ Recommended For You</h3>
            <div className="grid sm:grid-cols-3 gap-5">
              {recP.map(p => (
                <div key={p.id} className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100 card-hover">
                  <div className="h-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center overflow-hidden mb-3">
                    {p.image_url ? <img src={p.image_url} className="h-full object-contain p-2" alt=""/> : <span className="text-5xl">{p.emoji||"🧴"}</span>}
                  </div>
                  <Chip text={p.tag||"New"} color="green"/>
                  <h4 style={{fontFamily:"'Cormorant Garamond',serif"}} className="font-bold text-emerald-900 mt-2 mb-1 text-lg">{p.name}</h4>
                  <p className="text-xs text-slate-500 mb-3">{p.description||p.desc||""}</p>
                  <div className="flex items-center justify-between">
                    <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-700">₹{p.price}</span>
                    <button onClick={()=>onBuy(p)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all active:scale-95">Buy Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="text-center mt-10 flex flex-col items-center gap-3">
          <span className="text-xs text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full">
            Analysis powered by Replicate · google/nano-banana
          </span>
          <button
            onClick={()=>{setStep(0);setAnswers({});setResult(null);setImgData(null);setImgPreview(null);setErr("");}}
            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium underline underline-offset-4">
            Retake the skin test
          </button>
        </div>
      </div>
    </div>
  );

  return null;
}

// ════════════════════════════════════════════════════════════
//  AI GLOW-UP PAGE  ← GLOWUP_API backend
// ════════════════════════════════════════════════════════════
function GlowUpPage() {
  const [originalFile,   setOriginalFile]   = useState(null);
  const [originalPreview,setOriginalPreview]= useState(null);
  const [glowedUrl,      setGlowedUrl]      = useState(null);
  const [loading,        setLoading]        = useState(false);
  const [err,            setErr]            = useState("");
  const [sliderPos,      setSliderPos]      = useState(50);
  const fileRef  = useRef();
  const wrapRef  = useRef();
  const dragging = useRef(false);

  function onFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10*1024*1024) { setErr("File too large — max 10 MB."); return; }
    setOriginalFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    setGlowedUrl(null);
    setErr("");
    setSliderPos(50);
  }

  async function runGlowUp() {
    if (!originalFile) { setErr("Please upload a photo first."); return; }
    setLoading(true); setErr("");
    const fd = new FormData();
    fd.append("image", originalFile);
    try {
      const res = await api.post("/glowup", fd, {headers:{"Content-Type":"multipart/form-data"}, timeout: 120000});
      setGlowedUrl(res.data.imageUrl);
    } catch(e) {
      const detail = e.response?.data?.detail || e.message || "Server error — please try again.";
      setErr("Glow-up failed: " + detail);
    }
    setLoading(false);
  }

  // Drag-to-compare slider
  function onMouseMove(e) {
    if (!dragging.current || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    setSliderPos(Math.max(2, Math.min(98, x)));
  }
  function onTouchMove(e) {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = (e.touches[0].clientX - rect.left) / rect.width * 100;
    setSliderPos(Math.max(2, Math.min(98, x)));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 fu">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-2xl shadow-purple-200 fl">✨</div>
          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">Powered by Replicate AI</span>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 leading-tight">
            AI Face <span className="italic text-purple-600">Glow-Up</span>
          </h1>
          <p className="text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
            Upload a selfie and our AI will enhance your natural glow — smoother skin, better lighting, radiant finish. Same you, just elevated. ✨
          </p>
        </div>

        {/* Upload area */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100 mb-6 fu d1">
          <div onClick={()=>fileRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${originalPreview?"border-purple-400 bg-purple-50":"border-slate-200 hover:border-purple-400 hover:bg-purple-50/50"}`}>
            {originalPreview ? (
              <div className="flex flex-col items-center gap-3">
                <img src={originalPreview} alt="original" className="w-36 h-36 object-cover rounded-2xl shadow-lg"/>
                <p className="text-purple-600 font-semibold text-sm">✓ Photo ready</p>
                <button onClick={e=>{e.stopPropagation();setOriginalFile(null);setOriginalPreview(null);setGlowedUrl(null);}} className="text-xs text-rose-400 hover:text-rose-600 underline">Remove & upload another</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-4xl">🤳</div>
                <p className="font-medium text-slate-600">Tap to upload your selfie</p>
                <p className="text-xs">JPG, PNG, WebP · Max 10 MB · Face clearly visible</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFile}/>
          </div>

          {err && <p className="text-rose-500 text-sm bg-rose-50 px-4 py-3 rounded-xl mt-4 text-center">{err}</p>}

          <button onClick={runGlowUp} disabled={!originalFile||loading}
            className="mt-5 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-purple-200 text-base">
            {loading
              ? <><Spinner sm/>Processing your glow-up… (may take ~30s)</>
              : <>✨ Generate My Glow-Up</>}
          </button>

          <p className="text-xs text-slate-400 text-center mt-3">Your photo is processed securely and never stored on our servers.</p>
        </div>

        {/* Before / After compare slider */}
        {glowedUrl && originalPreview && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 fu">
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-slate-800 mb-1 text-center">Before & After</h3>
            <p className="text-xs text-slate-400 text-center mb-5">← Drag to compare →</p>

            <div ref={wrapRef} className="compare-wrapper select-none"
              style={{height:"420px"}}
              onMouseDown={()=>{dragging.current=true;}}
              onMouseUp={()=>{dragging.current=false;}}
              onMouseMove={onMouseMove}
              onMouseLeave={()=>{dragging.current=false;}}
              onTouchMove={onTouchMove}>

              {/* Before (full width) */}
              <img src={originalPreview} alt="Before" className="w-full h-full object-cover"/>

              {/* After (clipped) */}
              <div className="compare-after" style={{clipPath:`inset(0 ${100-sliderPos}% 0 0)`}}>
                <img src={glowedUrl} alt="After" className="w-full h-full object-cover"/>
              </div>

              {/* Handle */}
              <div className="compare-handle" style={{left:`${sliderPos}%`}}>
                <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"36px",height:"36px",background:"white",borderRadius:"50%",boxShadow:"0 2px 12px rgba(0,0,0,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:"bold",color:"#7c3aed"}}>
                  ⟺
                </div>
              </div>

              {/* Labels */}
              <span className="absolute bottom-3 left-4 bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full pointer-events-none">BEFORE</span>
              <span className="absolute bottom-3 right-4 bg-purple-600/80 text-white text-xs font-bold px-3 py-1 rounded-full pointer-events-none">AFTER ✨</span>
            </div>

            <div className="mt-5 flex gap-3 justify-center">
              <a href={glowedUrl} download="prottiva-glowup.jpg"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all active:scale-95 flex items-center gap-2">
                ⬇️ Download Result
              </a>
              <button onClick={()=>{setOriginalFile(null);setOriginalPreview(null);setGlowedUrl(null);}}
                className="border border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-600 font-semibold px-6 py-2.5 rounded-full text-sm transition-all">
                Try Another Photo
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="grid grid-cols-3 gap-4 mt-6 fu d2">
          {[["💡","Best results with","good natural lighting"],["🤳","Face clearly","visible in frame"],["🔒","Privacy first","photo never stored"]].map(([e,t,d])=>(
            <div key={t} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-purple-100">
              <div className="text-2xl mb-2">{e}</div>
              <p className="text-xs font-semibold text-slate-700">{t}</p>
              <p className="text-xs text-slate-400">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  HOME PAGE
// ════════════════════════════════════════════════════════════
function HomePage({ setPage, onBuy, onWishlist, wishlist, products }) {
  const testimonials = [
    {name:"Priya S.",loc:"Mumbai",text:"Hydra Boost Serum transformed my dry skin in 2 weeks. My face feels like glass!",rating:5,emoji:"👩"},
    {name:"Rahul M.",loc:"Delhi",text:"The AI skin test recommended the perfect routine for my oily skin. Acne is gone!",rating:5,emoji:"👨"},
    {name:"Anita K.",loc:"Bangalore",text:"The Glow-Up AI is magical! The before/after was unreal.",rating:5,emoji:"👩‍💼"},
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-screen flex items-center pt-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full bg-emerald-100/60 blur-3xl pu"/>
        <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full bg-teal-100/50 blur-3xl pu"/>
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="fu">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-4 py-2 rounded-full mb-6">🧬 India's Science-Backed Skincare</span>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-5xl md:text-6xl lg:text-7xl font-bold text-emerald-950 leading-[1.05] mb-5">
              Nutrition your<br/><span className="italic text-emerald-600">skin deserves</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-md mb-8">Clinically formulated skincare driven by nutritional science. No fluff — only ingredients proven to work.</p>
            <div className="flex flex-wrap gap-4 mb-6">
              <button onClick={()=>setPage("Shop")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-full shadow-xl shadow-emerald-200 hover:-translate-y-0.5 transition-all active:scale-95">Shop Now →</button>
              <button onClick={()=>setPage("Skin Test")} className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-full transition-all active:scale-95">🔬 AI Skin Test</button>
              <button onClick={()=>setPage("Glow-Up")} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl shadow-purple-200 hover:-translate-y-0.5 transition-all active:scale-95">✨ Try Glow-Up</button>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {["🌿 Vegan","🔬 Dermatologist Tested","🇮🇳 Made in India","🐰 Cruelty-free"].map(b => (
                <span key={b} className="text-sm text-slate-500 font-medium">{b}</span>
              ))}
            </div>
          </div>

          <div className="hidden md:flex justify-center fu d3">
            <div className="relative">
              <div style={{width:"340px",height:"340px"}} className="rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center text-9xl fl shadow-2xl shadow-emerald-200">🌿</div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-emerald-100"><p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Skin Score</p><p style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl font-bold text-emerald-700">92/100</p></div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-emerald-100"><p className="text-xs text-slate-400">Happy Customers</p><p style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-800">50,000+</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature banners */}
      <section className="grid md:grid-cols-2">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 py-14 px-8 flex flex-col gap-4">
          <span className="text-4xl">🔬</span>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-white">AI Skin Analysis</h2>
          <p className="text-emerald-100 text-sm leading-relaxed">5 questions + selfie = your personalised routine, ingredients guide & product picks.</p>
          <button onClick={()=>setPage("Skin Test")} className="self-start bg-white text-emerald-700 font-bold px-6 py-3 rounded-full hover:bg-emerald-50 transition-all active:scale-95 text-sm">Take Free Test →</button>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-14 px-8 flex flex-col gap-4">
          <span className="text-4xl">✨</span>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-white">AI Face Glow-Up</h2>
          <p className="text-purple-100 text-sm leading-relaxed">Upload a selfie — our AI enhances your natural radiance with a stunning before/after comparison.</p>
          <button onClick={()=>setPage("Glow-Up")} className="self-start bg-white text-purple-700 font-bold px-6 py-3 rounded-full hover:bg-purple-50 transition-all active:scale-95 text-sm">Try Glow-Up →</button>
        </div>
      </section>

      {/* Best Sellers */}
      {products && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-emerald-500 text-xs uppercase tracking-widest font-bold mb-1">Best Sellers</p>
              <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl md:text-4xl font-bold text-emerald-950">Loved by customers</h2>
            </div>
            <button onClick={()=>setPage("Shop")} className="hidden sm:block text-emerald-600 font-semibold text-sm hover:underline">View all →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.slice(0,4).map((p,i) => (
              <div key={p.id} style={{animationDelay:(i*0.08)+"s"}} className="fu">
                <ProductCard p={p} onBuy={onBuy} onWishlist={onWishlist} wishlisted={wishlist.some(w=>w.id===p.id)}/>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-emerald-950 to-teal-950 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl md:text-4xl font-bold text-white">What our customers say</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t,i) => (
              <div key={t.name} style={{animationDelay:(i*0.1)+"s"}} className="fu bg-white/5 hover:bg-white/10 rounded-3xl p-6 border border-white/10 transition-colors">
                <Stars r={t.rating}/>
                <p className="text-emerald-100 text-sm leading-relaxed mt-3 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-xl">{t.emoji}</div>
                  <div><p className="text-white font-semibold text-sm">{t.name}</p><p className="text-emerald-400 text-xs">{t.loc}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════════════════
//  SHOP PAGE
// ════════════════════════════════════════════════════════════
function ShopPage({ onBuy, onWishlist, wishlist, products }) {
  const [cat,    setCat]    = useState("All");
  const [sort,   setSort]   = useState("default");
  const [search, setSearch] = useState("");

  const filtered = (cat==="All" ? products : products.filter(p => p.cat===cat||p.category===cat))
    .filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sort==="low"?a.price-b.price : sort==="high"?b.price-a.price : sort==="rating"?(b.rating||5)-(a.rating||5) : 0);

  return (
    <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-8 fu">
        <p className="text-emerald-500 text-xs uppercase tracking-widest font-bold mb-1">Prottiva Nutrition</p>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl font-bold text-emerald-950">Shop All Products</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…"
          className="border border-slate-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white w-full sm:w-64"/>
        <div className="flex flex-wrap gap-2 flex-1">
          {CATS.map(c => (
            <button key={c} onClick={()=>setCat(c)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${cat===c?"bg-emerald-600 text-white shadow-md":"bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"}`}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="text-sm border border-slate-200 rounded-full px-4 py-2 focus:outline-none focus:border-emerald-400 bg-white text-slate-700">
          <option value="default">Default</option>
          <option value="low">Price ↑</option>
          <option value="high">Price ↓</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
      <p className="text-slate-400 text-sm mb-5">{filtered.length} product{filtered.length!==1?"s":""}</p>
      {filtered.length === 0
        ? <div className="text-center py-24"><div className="text-7xl mb-4">🔍</div><p className="text-slate-500">No products found.</p></div>
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((p,i) => (
              <div key={p.id} style={{animationDelay:(i*0.04)+"s"}} className="fu">
                <ProductCard p={p} onBuy={onBuy} onWishlist={onWishlist} wishlisted={wishlist.some(w=>w.id===p.id)}/>
              </div>
            ))}
          </div>
        )}
    </main>
  );
}

// ════════════════════════════════════════════════════════════
//  CART PAGE
// ════════════════════════════════════════════════════════════
function CartPage({ cart, setCart, setPage }) {
  function remove(id) { setCart(c => c.filter(i=>i.p.id!==id)); }
  function upQty(id, delta) { setCart(c => c.map(i => i.p.id===id ? {...i,qty:Math.max(1,i.qty+delta)} : i)); }

  const subtotal = cart.reduce((a,i) => a+i.p.price*i.qty, 0);
  const shipping  = subtotal>=999 ? 0 : 99;
  const total     = subtotal+shipping;

  return (
    <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
      <div className="mb-8 fu">
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl font-bold text-emerald-950">Shopping Cart</h1>
        <p className="text-slate-500 mt-1">{cart.length} item{cart.length!==1?"s":""}</p>
      </div>
      {cart.length===0 ? (
        <div className="text-center py-24 fu">
          <div className="text-7xl mb-4">🛒</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
          <p className="text-slate-400 mb-6">Add some products to get started</p>
          <button onClick={()=>setPage("Shop")} className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-emerald-700 transition-all active:scale-95">Shop Now</button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map(({p,qty}) => (
              <div key={p.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-5 fu">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {p.image_url ? <img src={p.image_url} className="w-full h-full object-contain p-2" alt=""/> : <span className="text-4xl">{p.emoji||"🧴"}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="font-bold text-emerald-950 text-lg">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.ml||p.volume||""}</p>
                  <p style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-700 mt-1">₹{(p.price*qty).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-3 py-2">
                    <button onClick={()=>upQty(p.id,-1)} className="w-6 h-6 rounded-full bg-white shadow text-slate-600 hover:text-emerald-600 font-bold text-sm flex items-center justify-center">−</button>
                    <span className="text-sm font-semibold w-4 text-center">{qty}</span>
                    <button onClick={()=>upQty(p.id,1)} className="w-6 h-6 rounded-full bg-white shadow text-slate-600 hover:text-emerald-600 font-bold text-sm flex items-center justify-center">+</button>
                  </div>
                  <button onClick={()=>remove(p.id)} className="w-8 h-8 rounded-full hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">🗑️</button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm fu">
              <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-950 mb-5">Order Summary</h3>
              <div className="flex flex-col gap-3 text-sm mb-5">
                <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-slate-600"><span>Shipping</span><span className={shipping===0?"text-emerald-600 font-medium":""}>{shipping===0?"FREE":"₹"+shipping}</span></div>
                {shipping>0 && <p className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">Add ₹{(999-subtotal).toLocaleString()} more for free shipping!</p>}
                <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-emerald-700 text-xl">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={()=>setPage("Checkout")} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 active:scale-95">
                Proceed to Checkout →
              </button>
              <button onClick={()=>setPage("Shop")} className="w-full mt-3 text-sm text-slate-500 hover:text-emerald-600 py-2 transition-colors">← Continue Shopping</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ════════════════════════════════════════════════════════════
//  CHECKOUT PAGE  ← STORE_API /create-order
// ════════════════════════════════════════════════════════════
function CheckoutPage({ cart, setCart, setPage, addPoints }) {
  const [step,    setStep]    = useState(1);
  const [addr,    setAddr]    = useState({name:"",phone:"",email:"",address:"",city:"",state:"",pincode:""});
  const [card,    setCard]    = useState({num:"",name:"",expiry:"",cvv:""});
  const [method,  setMethod]  = useState("card");
  const [upiId,   setUpiId]   = useState("");
  const [loading, setLoading] = useState(false);
  const [addrErr, setAddrErr] = useState("");
  const [payErr,  setPayErr]  = useState("");
  const [orderId, setOrderId] = useState("");

  const subtotal    = cart.reduce((a,i) => a+i.p.price*i.qty, 0);
  const shipping    = subtotal>=999 ? 0 : 99;
  const total       = subtotal+shipping;
  const pointsEarned= Math.floor(total/10);

  function chA(e) { setAddr(x=>({...x,[e.target.name]:e.target.value})); setAddrErr(""); }
  function chC(e) {
    let v = e.target.value;
    if (e.target.name==="num")    v = v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
    if (e.target.name==="expiry") v = v.replace(/\D/g,"").slice(0,4).replace(/(\d{2})(\d)/,"$1/$2");
    if (e.target.name==="cvv")    v = v.replace(/\D/g,"").slice(0,3);
    setCard(x=>({...x,[e.target.name]:v})); setPayErr("");
  }

  function nextToPayment() {
    if (!addr.name||!addr.phone||!addr.email||!addr.address||!addr.city||!addr.pincode) { setAddrErr("Please fill all required fields."); return; }
    setStep(2);
  }

  async function pay(e) {
    e.preventDefault();
    if (method==="card") {
      if (card.num.replace(/\s/g,"").length<16||!card.name||card.expiry.length<5||card.cvv.length<3) { setPayErr("Please enter valid card details."); return; }
    }
    if (method==="upi" && !upiId.includes("@")) { setPayErr("Please enter a valid UPI ID (e.g. name@upi)."); return; }

    setLoading(true); setPayErr("");
    try {
      const items = cart.map(i => ({id:String(i.p.id), name:i.p.name, qty:i.qty, price:i.p.price}));
      const res = await api.post("/create-order", {
        name:   addr.name,
        email:  addr.email,
        phone:  addr.phone,
        amount: total,
        items,
      });
      setOrderId(res.data.order_id);
      addPoints(pointsEarned);
      setCart([]);
      setStep(3);
    } catch(err) {
      setPayErr(err.response?.data?.detail || "Payment failed — please try again.");
    }
    setLoading(false);
  }

  if (step===3) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white pt-28 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center bi">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl shadow-emerald-200">✅</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl font-bold text-emerald-900 mb-2">Order Confirmed!</h2>
        <p className="text-slate-600 mb-3">Thank you, <strong>{addr.name}</strong>! Your order has been placed successfully.</p>
        <div className="bg-emerald-50 rounded-2xl p-4 mb-4 border border-emerald-100">
          <p className="text-emerald-700 font-semibold text-sm">🎁 You earned <strong>{pointsEarned} Prottiva Points!</strong></p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left text-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Order Details</p>
          <p className="text-slate-700">🔖 Order ID: <strong className="font-mono text-xs">{orderId}</strong></p>
          <p className="text-slate-700 mt-1">📦 Delivery: <strong>3–5 business days</strong></p>
          <p className="text-slate-700 mt-1">📧 Confirmation: <strong>{addr.email}</strong></p>
          <p className="font-bold text-emerald-700 mt-2">Total Paid: ₹{total.toLocaleString()}</p>
        </div>
        <button onClick={()=>setPage("Shop")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all active:scale-95">Continue Shopping →</button>
      </div>
    </div>
  );

  return (
    <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
      <div className="mb-8">
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl font-bold text-emerald-950">Checkout</h1>
        <div className="flex items-center gap-3 mt-4">
          {["Delivery","Payment"].map((s,i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step>i+1?"bg-emerald-600 text-white":step===i+1?"bg-emerald-600 text-white":"bg-slate-200 text-slate-400"}`}>
                {step>i+1?"✓":i+1}
              </div>
              <span className={`text-sm font-medium ${step>=i+1?"text-emerald-700":"text-slate-400"}`}>{s}</span>
              {i<1 && <div className="w-8 h-px bg-slate-200 mx-1"/>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1 – Address */}
          {step===1 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm fu">
              <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-950 mb-5">📦 Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Inp label="Full Name *"  name="name"    value={addr.name}    onChange={chA} placeholder="Anika Sharma"/>
                <Inp label="Phone *"      name="phone"   type="tel" value={addr.phone} onChange={chA} placeholder="+91 98765 43210"/>
                <div className="sm:col-span-2"><Inp label="Email *" name="email" type="email" value={addr.email} onChange={chA} placeholder="anika@email.com"/></div>
                <div className="sm:col-span-2"><Inp label="Address *" name="address" value={addr.address} onChange={chA} placeholder="Flat / House no, Street, Area"/></div>
                <Inp label="City *"   name="city"    value={addr.city}    onChange={chA} placeholder="Bangalore"/>
                <Inp label="State"    name="state"   value={addr.state}   onChange={chA} placeholder="Karnataka"/>
                <Inp label="PIN Code *" name="pincode" value={addr.pincode} onChange={chA} placeholder="560034"/>
              </div>
              {addrErr && <p className="text-rose-500 text-sm bg-rose-50 px-4 py-2 rounded-xl mt-4">{addrErr}</p>}
              <button onClick={nextToPayment} className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-200">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2 – Payment */}
          {step===2 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm fu">
              <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-950 mb-5">💳 Payment</h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[["card","💳 Card"],["upi","📱 UPI"],["cod","🏠 COD"]].map(([m,l]) => (
                  <button key={m} onClick={()=>setMethod(m)} className={`py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${method===m?"border-emerald-500 bg-emerald-50 text-emerald-700":"border-slate-200 text-slate-500 hover:border-emerald-300"}`}>{l}</button>
                ))}
              </div>
              <form onSubmit={pay} className="flex flex-col gap-4">
                {method==="card" && (
                  <>
                    {/* Live card visual */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-5 text-white shadow-xl shadow-emerald-200 mb-2">
                      <div className="flex justify-between items-start mb-8">
                        <Logo h={26}/>
                        <span className="text-sm font-bold opacity-80">VISA</span>
                      </div>
                      <p className="text-lg font-mono tracking-widest mb-4">{card.num||"•••• •••• •••• ••••"}</p>
                      <div className="flex justify-between text-xs">
                        <div><p className="opacity-60 mb-0.5">CARD HOLDER</p><p className="font-semibold uppercase">{card.name||"YOUR NAME"}</p></div>
                        <div><p className="opacity-60 mb-0.5">EXPIRES</p><p className="font-semibold">{card.expiry||"MM/YY"}</p></div>
                      </div>
                    </div>
                    <Inp label="Card Number"       name="num"    value={card.num}    onChange={chC} placeholder="1234 5678 9012 3456"/>
                    <Inp label="Cardholder Name"   name="name"   value={card.name}   onChange={chC} placeholder="ANIKA SHARMA"/>
                    <div className="grid grid-cols-2 gap-4">
                      <Inp label="Expiry" name="expiry" value={card.expiry} onChange={chC} placeholder="MM/YY"/>
                      <Inp label="CVV"    name="cvv"    value={card.cvv}    onChange={chC} placeholder="•••"/>
                    </div>
                  </>
                )}
                {method==="upi" && (
                  <div>
                    <div className="text-center py-6 bg-slate-50 rounded-2xl mb-4">
                      <div className="text-5xl mb-3">📱</div>
                      <p className="text-slate-600 font-medium mb-1">Pay via UPI</p>
                      <p className="text-slate-400 text-sm">Enter your UPI ID below</p>
                    </div>
                    <Inp label="UPI ID" name="upiId" value={upiId} onChange={e=>setUpiId(e.target.value)} placeholder="yourname@okaxis"/>
                  </div>
                )}
                {method==="cod" && (
                  <div className="bg-amber-50 rounded-2xl p-6 text-center border border-amber-100">
                    <div className="text-5xl mb-3">🏠</div>
                    <p className="font-semibold text-amber-800">Cash on Delivery</p>
                    <p className="text-sm text-amber-600 mt-1">Pay ₹{total.toLocaleString()} when your order arrives.</p>
                  </div>
                )}
                {payErr && <p className="text-rose-500 text-sm bg-rose-50 px-4 py-2 rounded-xl">{payErr}</p>}
                <button type="submit" disabled={loading} className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 active:scale-95 text-base">
                  {loading ? <><Spinner sm/>Processing…</> : <>🔒 Place Order · ₹{total.toLocaleString()}</>}
                </button>
                <p className="text-xs text-slate-400 text-center">🔒 Secured payment · Order saved to database</p>
              </form>
            </div>
          )}
        </div>

        {/* Order sidebar */}
        <div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm sticky top-28">
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-lg font-bold text-emerald-950 mb-4">Your Order</h3>
            <div className="flex flex-col gap-3 mb-4 max-h-52 overflow-y-auto scrollbar-hide">
              {cart.map(({p,qty}) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {p.image_url ? <img src={p.image_url} className="w-full h-full object-contain p-1" alt=""/> : <span className="text-2xl">{p.emoji||"🧴"}</span>}
                  </div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-700 truncate">{p.name}</p><p className="text-xs text-slate-400">Qty {qty}</p></div>
                  <span className="text-sm font-bold text-emerald-700 flex-shrink-0">₹{(p.price*qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-slate-600"><span>Shipping</span><span className={shipping===0?"text-emerald-600 font-medium":""}>{shipping===0?"FREE":"₹"+shipping}</span></div>
              <div className="flex justify-between font-bold text-base border-t border-slate-100 pt-2 mt-1">
                <span>Total</span><span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-emerald-700 text-xl">₹{total.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-3 bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
              <p className="text-xs text-emerald-600 font-semibold">🎁 Earn <strong>{pointsEarned} Prottiva Points</strong> on this order!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ════════════════════════════════════════════════════════════
//  WISHLIST PAGE
// ════════════════════════════════════════════════════════════
function WishlistPage({ wishlist, onWishlist, onBuy }) {
  return (
    <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
      <div className="mb-8 fu">
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl font-bold text-emerald-950">My Wishlist</h1>
        <p className="text-slate-500 mt-1">{wishlist.length} item{wishlist.length!==1?"s":""} saved</p>
      </div>
      {wishlist.length===0 ? (
        <div className="text-center py-24 fu">
          <div className="text-7xl mb-4">🤍</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-slate-700 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-400">Save products you love for later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlist.map(p => (
            <ProductCard key={p.id} p={p} onBuy={onBuy} onWishlist={onWishlist} wishlisted={true}/>
          ))}
        </div>
      )}
    </main>
  );
}

// ════════════════════════════════════════════════════════════
//  ABOUT PAGE
// ════════════════════════════════════════════════════════════
function AboutPage() {
  const team=[
    {name:"Dr. Priya Nair",role:"Co-Founder & Chief Dermatologist",emoji:"👩‍⚕️"},
    {name:"Arjun Mehra",role:"Formulation Scientist",emoji:"👨‍🔬"},
    {name:"Sneha Pillai",role:"Head of AI Research",emoji:"👩‍💻"},
  ];
  return (
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto text-center mb-16 fu">
        <span className="text-emerald-500 text-xs uppercase tracking-widest font-bold">Our Story</span>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl md:text-5xl font-bold text-emerald-950 mt-2 mb-4 leading-tight">
          Skincare built on <span className="italic text-emerald-600">nutrition & truth</span>
        </h1>
        <p className="text-slate-600 text-lg leading-relaxed">Prottiva Nutrition was founded in 2021 by a dermatologist and a nutritional biochemist who believed the industry was overcomplicating the wrong things.</p>
      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5 mb-16 px-2">
        {[{e:"🔬",t:"Mission",d:"Make dermatologist-grade skincare accessible to every Indian through nutritional science."},{e:"🌿",t:"Philosophy",d:"Skin reflects internal health. We formulate from the outside in, using nutrition-led actives."},{e:"🤖",t:"Technology",d:"AI personalises your skincare journey — from diagnosis to the right recommendation."}].map((v,i)=>(
          <div key={v.t} style={{animationDelay:(i*0.1)+"s"}} className="fu bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-7 border border-emerald-100">
            <span className="text-4xl">{v.e}</span>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-900 mt-4 mb-2">{v.t}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{v.d}</p>
          </div>
        ))}
      </div>
      <div className="max-w-3xl mx-auto mb-16 px-2">
        <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl font-bold text-emerald-900 text-center mb-8">Meet the Team</h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {team.map((t,i)=>(
            <div key={t.name} style={{animationDelay:(i*0.1)+"s"}} className="fu text-center bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 card-hover">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-3">{t.emoji}</div>
              <h4 style={{fontFamily:"'Cormorant Garamond',serif"}} className="font-bold text-emerald-900 text-lg">{t.name}</h4>
              <p className="text-slate-400 text-xs mt-1">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-700 to-teal-700 rounded-3xl p-12 text-center text-white">
        <p style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl md:text-3xl italic leading-relaxed text-emerald-50">"We don't make products. We make solutions — backed by science you can trust."</p>
        <span className="text-emerald-300 text-sm font-medium mt-5 block">— Dr. Priya Nair, Co-Founder</span>
      </div>
    </main>
  );
}

// ════════════════════════════════════════════════════════════
//  CONTACT PAGE
// ════════════════════════════════════════════════════════════
function ContactPage() {
  const [f,setF]=useState({name:"",email:"",subject:"",msg:""});
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false);
  function ch(e){setF(x=>({...x,[e.target.name]:e.target.value}));}
  async function sub(e){
    e.preventDefault();
    if(!f.name||!f.email||!f.msg) return;
    setLoading(true);await new Promise(r=>setTimeout(r,1000));setLoading(false);setSent(true);
  }
  return (
    <main className="pt-28 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 fu">
          <span className="text-emerald-500 text-xs uppercase tracking-widest font-bold">Get In Touch</span>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl md:text-5xl font-bold text-emerald-950 mt-2">We'd love to hear <span className="italic text-emerald-600">from you</span></h1>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-4 fu d1">
            {[["📍","Address","14, Koramangala 4th Block, Bangalore – 560034"],["📧","Email","hello@prottiva.in"],["📞","Phone","+91 98765 43210"],["⏰","Support","Mon–Sat, 9 AM – 6 PM IST"]].map(([e,t,d])=>(
              <div key={t} className="flex gap-4 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <span className="text-2xl">{e}</span>
                <div><p className="font-semibold text-emerald-800 text-sm">{t}</p><p className="text-slate-600 text-sm">{d}</p></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-3xl p-7 shadow-sm border border-emerald-100 fu d2">
            {sent ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">✅</div>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-800 mb-2">Message Sent!</h3>
                <p className="text-slate-500">We'll get back to you within 24 hours.</p>
                <button onClick={()=>setSent(false)} className="mt-5 text-emerald-600 underline text-sm">Send another</button>
              </div>
            ) : (
              <form onSubmit={sub} className="flex flex-col gap-4">
                <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-900 mb-1">Send us a message</h3>
                <Inp label="Full Name" name="name" value={f.name} onChange={ch} placeholder="Anika Sharma"/>
                <Inp label="Email" name="email" type="email" value={f.email} onChange={ch} placeholder="you@email.com"/>
                <Inp label="Subject" name="subject" value={f.subject} onChange={ch} placeholder="Order enquiry…"/>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Message</label>
                  <textarea name="msg" value={f.msg} onChange={ch} placeholder="Your message…" rows={4} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 resize-none"/>
                </div>
                <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                  {loading && <Spinner sm/>}{loading?"Sending…":"Send Message →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ════════════════════════════════════════════════════════════
//  LIVE CHAT  (Claude AI)
// ════════════════════════════════════════════════════════════
function LiveChat() {
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState([{from:"bot",text:"Hi! 👋 I'm Priya, your Prottiva skincare advisor. How can I help you today?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef();
  useEffect(()=>{if(endRef.current)endRef.current.scrollIntoView({behavior:"smooth"});},[msgs]);

  async function send(){
    if(!input.trim()||loading)return;
    const userMsg=input.trim(); setInput("");
    setMsgs(m=>[...m,{from:"user",text:userMsg}]);
    setLoading(true);
    try{
      const history=msgs.filter(m=>m.from==="bot"||m.from==="user").map(m=>({role:m.from==="user"?"user":"assistant",content:m.text}));
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":CLAUDE_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,
          system:"You are Priya, a friendly skincare advisor for Prottiva Nutrition, a science-backed Indian brand. Answer concisely in 2-3 sentences. Be warm and knowledgeable.",
          messages:[...history,{role:"user",content:userMsg}]})});
      const data=await res.json();
      const text=data.content?.[0]?.text||"I'm sorry, I couldn't process that. Please try again!";
      setMsgs(m=>[...m,{from:"bot",text}]);
    }catch{
      setMsgs(m=>[...m,{from:"bot",text:"Sorry, I'm having trouble connecting right now. Please try again!"}]);
    }
    setLoading(false);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-80 bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden si">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">👩‍⚕️</div>
            <div><p className="text-white font-semibold text-sm">Priya · AI Advisor</p><p className="text-emerald-200 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"/>Online</p></div>
            <button onClick={()=>setOpen(false)} className="ml-auto text-white/70 hover:text-white">✕</button>
          </div>
          <div className="h-64 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
            {msgs.map((m,i) => (
              <div key={i} className={`flex ${m.from==="user"?"justify-end":"justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from==="user"?"bg-emerald-600 text-white rounded-br-sm":"bg-slate-100 text-slate-700 rounded-bl-sm"}`}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">{[0,1,2].map(i=><span key={i} style={{animationDelay:i*0.2+"s"}} className="w-2 h-2 rounded-full bg-slate-400 pu inline-block"/>)}</div>
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
              placeholder="Ask about your skin…"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-emerald-400"/>
            <button onClick={send} disabled={!input.trim()||loading} className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center text-sm transition-all disabled:opacity-40 active:scale-95">→</button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-2xl shadow-emerald-300 flex items-center justify-center text-2xl hover:scale-110 transition-all active:scale-95">
        {open?"✕":"💬"}
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  FOOTER
// ════════════════════════════════════════════════════════════
function Footer({ setPage }) {
  return (
    <footer className="bg-emerald-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Logo h={44}/>
          <p className="text-emerald-300 text-sm mt-4 leading-relaxed">Science-backed skincare nutrition. Made in India, for every skin type.</p>
          <div className="flex gap-3 mt-5">
            {["📘","📸","▶️","🐦"].map(s => (
              <button key={s} className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-sm transition-colors">{s}</button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-emerald-100 mb-4 text-xs uppercase tracking-widest">Navigate</h4>
          <ul className="flex flex-col gap-2.5">
            {["Home","Shop","Skin Test","Glow-Up","About","Contact"].map(l => (
              <li key={l}><button onClick={()=>setPage(l)} className="text-emerald-300 hover:text-white text-sm transition-colors">{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-emerald-100 mb-4 text-xs uppercase tracking-widest">Support</h4>
          <ul className="flex flex-col gap-2.5 text-emerald-300 text-sm">
            {["Shipping Policy","Returns & Refunds","Track My Order","FAQs","Privacy Policy"].map(l => (
              <li key={l}><button className="hover:text-white transition-colors">{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-emerald-100 mb-4 text-xs uppercase tracking-widest">Newsletter</h4>
          <p className="text-emerald-300 text-sm mb-3">Skincare tips & exclusive offers.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="your@email.com" className="flex-1 bg-white/10 text-white placeholder-emerald-400 border border-white/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-400"/>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-full text-sm transition-colors">→</button>
          </div>
          <div className="mt-4 flex flex-col gap-1.5 text-emerald-400 text-xs">
            <span>📍 Bangalore, Karnataka</span>
            <span>📧 hello@prottiva.in</span>
            <span>📞 +91 98765 43210</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-emerald-400 text-xs">
        <span>© 2026 Prottiva Nutrition Pvt. Ltd. All rights reserved.</span>
        <span>GST: 29AAPCP1234K1ZX · FSSAI: 10019022001234</span>
      </div>
    </footer>
  );
}

// ════════════════════════════════════════════════════════════
//  LOYALTY POINTS BADGE
// ════════════════════════════════════════════════════════════
function PointsBadge({ points }) {
  if (!points) return null;
  return (
    <div className="fixed top-20 right-4 z-40 bg-white border border-emerald-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 si">
      <span className="text-2xl">🏆</span>
      <div>
        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Prottiva Points</p>
        <p style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-900">{points.toLocaleString()} pts</p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
//  ROOT APP
// ════════════════════════════════════════════════════════════
export default function App() {
  const [page,      setPage]      = useState("Home");
  const [products,  setProducts]  = useState([]);
  const [loadingP,  setLoadingP]  = useState(true);
  const [cart,      setCart]      = useState([]);
  const [wishlist,  setWishlist]  = useState([]);
  const [modal,     setModal]     = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [user,      setUser]      = useState(null);
  const [points,    setPoints]    = useState(0);
  const [toast,     setToast]     = useState(null);

  // ── Fetch products from STORE_API ──────────────────────
  useEffect(() => {
    api.get("/products")
      .then(r => setProducts(r.data.products||[]))
      .catch(err => console.error("❌ Store API:", err.message))
      .finally(() => setLoadingP(false));
  }, []);

  function navigate(p) { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); }
  function onBuy(p)    { setModal(p); }

  function addToCart(p, qty) {
    setCart(c => {
      const ex = c.find(i => i.p.id===p.id);
      return ex ? c.map(i => i.p.id===p.id ? {...i,qty:i.qty+qty} : i) : [...c,{p,qty}];
    });
    setModal(null);
    showToast("🛒 Added to cart!");
  }

  function onWishlist(p) {
    setWishlist(w => {
      const has = w.some(i => i.id===p.id);
      showToast(has?"🤍 Removed from wishlist":"❤️ Added to wishlist!");
      return has ? w.filter(i=>i.id!==p.id) : [...w,p];
    });
  }

  function addPoints(n) { setPoints(x => x+n); }
  function showToast(msg) { setToast(msg); setTimeout(()=>setToast(null),2500); }

  const sharedProps = { onBuy, onWishlist, wishlist, products };

  return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'DM Sans', sans-serif"}}>
      <Navbar page={page} setPage={navigate} cart={cart} wishlist={wishlist} user={user} setAuthModal={setAuthModal}/>

      {loadingP ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner/>
            <p className="text-slate-400 text-sm">Loading Prottiva…</p>
          </div>
        </div>
      ) : (
        <>
          {page==="Home"      && <HomePage   setPage={navigate} {...sharedProps}/>}
          {page==="Shop"      && <ShopPage   {...sharedProps}/>}
          {page==="Skin Test" && <SkinTestPage onBuy={onBuy} products={products}/>}
          {page==="Glow-Up"   && <GlowUpPage/>}
          {page==="About"     && <AboutPage/>}
          {page==="Contact"   && <ContactPage/>}
          {page==="Cart"      && <CartPage cart={cart} setCart={setCart} setPage={navigate}/>}
          {page==="Checkout"  && <CheckoutPage cart={cart} setCart={setCart} setPage={navigate} addPoints={addPoints}/>}
          {page==="Wishlist"  && <WishlistPage wishlist={wishlist} onWishlist={onWishlist} onBuy={onBuy}/>}
        </>
      )}

      <Footer setPage={navigate}/>

      {modal     && <ProductModal p={modal} onClose={()=>setModal(null)} onAddToCart={addToCart} onWishlist={onWishlist} wishlisted={wishlist.some(w=>w.id===modal.id)}/>}
      {authModal && <AuthModal mode={authModal} onClose={()=>setAuthModal(null)} onAuth={n=>{setUser(n);setAuthModal(null);showToast("👋 Welcome, "+n+"!");}}/>}

      <LiveChat/>
      <PointsBadge points={points}/>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold si">
          {toast}
        </div>
      )}
    </div>
  );
}