import { useState, useEffect, useRef } from "react";


import api from "./api";


/* ─── Logo (real PNG) ─────────────────────────────────────── */
const LOGO_SRC = "/logo.png";

/* ─── Google Fonts ───────────────────────────────────────── */
if (!document.getElementById("prottiva-fonts")) {
  const l = document.createElement("link");
  l.id = "prottiva-fonts";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
  document.head.appendChild(l);
}

/* ─── CSS ────────────────────────────────────────────────── */
if (!document.getElementById("prottiva-styles")) {
  const s = document.createElement("style");
  s.id = "prottiva-styles";
  s.textContent = `
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes spinR{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes pulse2{0%,100%{opacity:.5}50%{opacity:1}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes bounceIn{0%{transform:scale(.8);opacity:0}70%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
    .fu{animation:fadeUp .5s ease both}
    .fi{animation:fadeIn .4s ease both}
    .fl{animation:floatY 3.5s ease-in-out infinite}
    .sp{animation:spinR 10s linear infinite}
    .pu{animation:pulse2 2.5s ease-in-out infinite}
    .si{animation:slideIn .35s ease both}
    .bi{animation:bounceIn .4s ease both}
    .d1{animation-delay:.08s}.d2{animation-delay:.16s}.d3{animation-delay:.24s}.d4{animation-delay:.32s}.d5{animation-delay:.4s}.d6{animation-delay:.48s}
    .shimmer{background:linear-gradient(90deg,#f0fdf4 25%,#d1fae5 50%,#f0fdf4 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
    .card-hover{transition:all .25s ease}
    .card-hover:hover{transform:translateY(-4px);box-shadow:0 20px 40px -8px rgba(5,150,105,.15)}
    .scrollbar-hide::-webkit-scrollbar{display:none}
    input[type=range]{accent-color:#059669}
    .glass{background:rgba(255,255,255,.85);backdrop-filter:blur(16px)}
  `;
  document.head.appendChild(s);
}

/* ─── Constants ──────────────────────────────────────────── */
const PRODUCTS = [
];




const CATS = ["All","Serum","Moisturiser","Sunscreen","Treatment","Eye Care","Toner","Mask"];
const SKIN_Q = [
  {id:"type",q:"How does your skin feel by midday?",opts:["Very oily / shiny","Dry and tight","Oily T-zone only","Comfortable & balanced","Sensitive & reactive"]},
  {id:"concern",q:"What is your #1 skin concern?",opts:["Acne / breakouts","Dryness / dehydration","Dark spots / uneven tone","Fine lines / wrinkles","Redness / sensitivity"]},
  {id:"texture",q:"How is your skin texture?",opts:["Rough & bumpy","Smooth overall","Large / visible pores","Flaky patches","Uneven / scarred"]},
  {id:"sun",q:"Daily sun exposure?",opts:["Mostly indoors","1-2 hrs","2-4 hrs","More than 4 hrs","Varies"]},
  {id:"routine",q:"What is your current skincare routine?",opts:["Nothing / very basic","Cleanser + moisturiser","3-4 step routine","Full AM/PM routine","I try many products"]},
];

/* ─── Helpers ─────────────────────────────────────────────── */
function Stars({r,sm=false}){
  return <span className="flex items-center gap-0.5">{[1,2,3,4,5].map(s=>(
    <svg key={s} viewBox="0 0 20 20" className={`${sm?"w-3 h-3":"w-4 h-4"} ${s<=Math.round(r)?"text-amber-400":"text-slate-200"}`} fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  ))}</span>;
}

function Chip({text,color="green"}){
  const c={green:"bg-emerald-100 text-emerald-700",teal:"bg-teal-100 text-teal-700",amber:"bg-amber-100 text-amber-700",rose:"bg-rose-100 text-rose-600",blue:"bg-sky-100 text-sky-600",purple:"bg-purple-100 text-purple-600"}[color]||"bg-emerald-100 text-emerald-700";
  return <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${c}`}>{text}</span>;
}

function Input({label,name,type="text",value,onChange,placeholder,required}){
  return(
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{label}</label>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"/>
    </div>
  );
}

/* ─── Logo Component ─────────────────────────────────────── */
function Logo({h=36}){
  return <img src={LOGO_SRC} alt="Prottiva Nutrition" style={{height:h,objectFit:"contain"}} />;
}

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar({page,setPage,cart,wishlist,user,setAuthModal}){
  const [open,setOpen]=useState(false);
  const [scroll,setScroll]=useState(false);
  const [search,setSearch]=useState("");
  const [searchOpen,setSearchOpen]=useState(false);
  const cartCount = cart.reduce((a,i)=>a+i.qty,0);
  useEffect(()=>{
    const h=()=>setScroll(window.scrollY>24);
    window.addEventListener("scroll",h);
    return()=>window.removeEventListener("scroll",h);
  },[]);

  const filtered = search.length>1 ? PRODUCTS.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase())) : [];

  return(
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scroll?"bg-white shadow-md shadow-emerald-100/60":"glass"} border-b border-emerald-100/60`}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-4">
        <button onClick={()=>setPage("Home")} className="flex-shrink-0"><Logo h={40}/></button>

        <ul className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {["Home","Shop","Skin Test","About","Contact"].map(l=>(
            <li key={l}><button onClick={()=>setPage(l)}
              className={`text-sm font-medium transition-all px-1 pb-0.5 ${page===l?"text-emerald-600 border-b-2 border-emerald-500":"text-slate-600 hover:text-emerald-600"}`}>
              {l==="Skin Test"?<span className="flex items-center gap-1.5">🔬{l}<span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">AI</span></span>:l}
            </button></li>
          ))}
        </ul>

        <div className="flex items-center gap-2 ml-auto">
          {/* Search */}
          <div className="relative hidden md:block">
            <input value={search} onChange={e=>setSearch(e.target.value)} onFocus={()=>setSearchOpen(true)} onBlur={()=>setTimeout(()=>setSearchOpen(false),200)}
              placeholder="Search products…" className="w-44 focus:w-56 transition-all border border-slate-200 rounded-full px-4 py-1.5 text-xs focus:outline-none focus:border-emerald-400 bg-slate-50"/>
            {searchOpen && filtered.length>0 && (
              <div className="absolute top-9 left-0 w-64 bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden z-50">
                {filtered.map(p=>(
                  <button key={p.id} onMouseDown={()=>{setPage("Shop");setSearch("");}} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-left">
                    <span className="text-2xl">{p.emoji}</span>
                    <div><p className="text-sm font-medium text-slate-800">{p.name}</p><p className="text-xs text-emerald-600">₹{p.price}</p></div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={()=>setPage("Wishlist")} className="relative w-9 h-9 rounded-full hover:bg-rose-50 flex items-center justify-center transition-colors text-lg">
            🤍
            {wishlist.length>0&&<span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{wishlist.length}</span>}
          </button>

          {/* Cart */}
          <button onClick={()=>setPage("Cart")} className="relative w-9 h-9 rounded-full hover:bg-emerald-50 flex items-center justify-center transition-colors text-lg">
            🛒
            {cartCount>0&&<span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>

          {/* Auth */}
          {user?(
            <button className="hidden md:flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">{user[0].toUpperCase()}</span>
              {user.split(" ")[0]}
            </button>
          ):(
            <div className="hidden md:flex items-center gap-2">
              <button onClick={()=>setAuthModal("login")} className="text-xs font-medium text-slate-600 hover:text-emerald-600 px-3 py-1.5 transition-colors">Log in</button>
              <button onClick={()=>setAuthModal("signup")} className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-full transition-all hover:shadow-md active:scale-95">Sign up</button>
            </div>
          )}
          <button className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-600" onClick={()=>setOpen(!open)}>{open?"✕":"☰"}</button>
        </div>
      </div>

      {open&&(
        <div className="lg:hidden bg-white border-t border-emerald-50 px-5 py-4 flex flex-col gap-3">
          {["Home","Shop","Skin Test","About","Contact","Cart","Wishlist"].map(l=>(
            <button key={l} onClick={()=>{setPage(l);setOpen(false);}} className={`text-left text-sm font-medium py-1 ${page===l?"text-emerald-600":"text-slate-600"}`}>{l}</button>
          ))}
          {!user&&<div className="flex gap-3 pt-2 border-t border-emerald-50">
            <button onClick={()=>{setAuthModal("login");setOpen(false);}} className="text-sm font-medium text-slate-600 px-4 py-2 border border-slate-200 rounded-full">Log in</button>
            <button onClick={()=>{setAuthModal("signup");setOpen(false);}} className="text-sm font-semibold bg-emerald-600 text-white px-4 py-2 rounded-full">Sign up</button>
          </div>}
        </div>
      )}
    </nav>
  );
}

/* ─── Auth Modal ─────────────────────────────────────────── */
function AuthModal({mode,onClose,onAuth}){
  const [tab,setTab]=useState(mode);
  const [f,setF]=useState({name:"",email:"",password:""});
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  function ch(e){setF(x=>({...x,[e.target.name]:e.target.value}));setErr("");}
  async function sub(e){
    e.preventDefault();
    if(!f.email||!f.password){setErr("Please fill all fields.");return;}
    if(tab==="signup"&&!f.name){setErr("Name is required.");return;}
    setLoading(true);
    await new Promise(r=>setTimeout(r,900));
    setLoading(false);
    onAuth(f.name||f.email.split("@")[0]);
  }
  return(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{backgroundColor:"rgba(0,0,0,.5)",backdropFilter:"blur(8px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden bi">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-7 flex flex-col items-center">
          <Logo h={44}/>
          <p className="text-emerald-100 text-xs mt-2">Science-backed skincare nutrition</p>
        </div>
        <div className="p-6">
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-5">
            {["login","signup"].map(t=>(
              <button key={t} onClick={()=>setTab(t)} className={`flex-1 text-sm font-semibold py-1.5 rounded-xl transition-all ${tab===t?"bg-white shadow text-emerald-700":"text-slate-400"}`}>
                {t==="login"?"Log In":"Sign Up"}
              </button>
            ))}
          </div>
          <form onSubmit={sub} className="flex flex-col gap-3">
            {tab==="signup"&&<Input label="Full Name" name="name" value={f.name} onChange={ch} placeholder="Anika Sharma"/>}
            <Input label="Email" name="email" type="email" value={f.email} onChange={ch} placeholder="you@email.com"/>
            <Input label="Password" name="password" type="password" value={f.password} onChange={ch} placeholder="••••••••"/>
            {err&&<p className="text-rose-500 text-xs bg-rose-50 px-3 py-2 rounded-lg">{err}</p>}
            <button type="submit" disabled={loading} className="mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
              {loading&&<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full sp inline-block"/>}
              {loading?"Please wait…":tab==="login"?"Log In →":"Create Account →"}
            </button>
          </form>
          <button onClick={onClose} className="w-full mt-3 text-slate-400 hover:text-slate-600 text-xs py-2 transition-colors">Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Card ───────────────────────────────────────── */
// function ProductCard({p,onBuy,onWishlist,wishlisted}){
//   const disc=Math.round((1-p.price/p.mrp)*100);
//   return(
//     <div className="bg-white rounded-3xl overflow-hidden border border-emerald-100/80 card-hover group flex flex-col">
//       <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 h-40 flex items-center justify-center text-6xl">
//         <span className="group-hover:scale-110 transition-transform duration-300 inline-block">{p.emoji}</span>
//         <span className="absolute top-3 left-3"><Chip text={p.tag} color="green"/></span>
//         <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{disc}% OFF</span>
//         <button onClick={()=>onWishlist(p)} className={`absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-base transition-all hover:scale-110 ${wishlisted?"text-rose-500":"text-slate-300 hover:text-rose-400"}`}>
//           {wishlisted?"❤️":"🤍"}
//         </button>
//       </div>
//       <div className="p-4 flex flex-col flex-1 gap-2">
//         <Chip text={p.cat} color="teal"/>
//         <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="font-bold text-emerald-950 text-lg leading-snug">{p.name}</h3>
//         <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 flex-1">{p.desc}</p>
//         <div className="flex items-center gap-2">
//           <Stars r={p.rating} sm/><span className="text-xs text-slate-400">({p.rev.toLocaleString()})</span>
//         </div>
//         <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100">
//           <div>
//             <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-800">₹{(p.price || 0).toLocaleString()}</span>
//             <span className="text-xs text-slate-400 line-through ml-1.5">
//   ₹{(p.mrp || 0).toLocaleString()}
// </span>
//           </div>
//           <button onClick={()=>onBuy(p)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-emerald-200 active:scale-95">
//             Buy Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



function ProductCard({p,onBuy,onWishlist,wishlisted}){
  // Safe Calculation for Discount
  const price = p.price || 0;
  const mrp = p.mrp || 0;
  const rating = p.rating || 5;
  const reviews = p.rev || 0;
  const disc = mrp > 0 ? Math.round((1 - price / mrp) * 100) : 0;

  return(
    <div className="bg-white rounded-3xl overflow-hidden border border-emerald-100/80 card-hover group flex flex-col">
      <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 h-40 flex items-center justify-center text-6xl">




     {p.image_url ? (
  <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-4" />
) : (
  <span>{p.emoji || "🧴"}</span>
)}






        <span className="absolute top-3 left-3"><Chip text={p.tag || "New"} color="green"/></span>
        <span className="absolute top-3 right-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{disc}% OFF</span>
        <button onClick={()=>onWishlist(p)} className={`absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-base transition-all hover:scale-110 ${wishlisted?"text-rose-500":"text-slate-300 hover:text-rose-400"}`}>
          {wishlisted?"❤️":"🤍"}
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-2">
        <Chip text={p.cat || "Skincare"} color="teal"/>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="font-bold text-emerald-950 text-lg leading-snug">{p.name || "Product Name"}</h3>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 flex-1">{p.desc || "No description available"}</p>
        <div className="flex items-center gap-2">
          <Stars r={rating} sm/><span className="text-xs text-slate-400">({reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100">
          <div>
            <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-800">₹{price.toLocaleString()}</span>
            {mrp > price && (
               <span className="text-xs text-slate-400 line-through ml-1.5">₹{mrp.toLocaleString()}</span>
            )}
          </div>
          <button onClick={()=>onBuy(p)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-emerald-200 active:scale-95">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}



/* ─── Product Modal ──────────────────────────────────────── */
// function ProductModal({p,onClose,onAddToCart,onWishlist,wishlisted}){
//   const [qty,setQty]=useState(1);
//   const [added,setAdded]=useState(false);
//   const disc=Math.round((1-p.price/p.mrp)*100);
//   function add(){onAddToCart(p,qty);setAdded(true);setTimeout(()=>setAdded(false),2000);}
//   return(
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:"rgba(0,0,0,.55)",backdropFilter:"blur(8px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
//       <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden bi max-h-[90vh] flex flex-col">
//         <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 flex gap-5 items-start relative flex-shrink-0">
//           <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/60 transition-all">✕</button>
//           <div className="w-28 h-28 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center text-6xl fl flex-shrink-0">{p.emoji}</div>
//           <div className="flex-1">
//             <div className="flex flex-wrap gap-2 mb-2">
//               <Chip text={p.tag} color="green"/><Chip text={p.cat} color="teal"/><Chip text={disc+"% OFF"} color="amber"/>
//             </div>
//             <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-950 leading-tight">{p.name}</h2>
//             <p className="text-slate-500 text-xs mt-1">{p.ml} · Prottiva Nutrition</p>
//             <div className="flex items-center gap-2 mt-2"><Stars r={p.rating}/><span className="text-xs text-slate-500">{p.rating} · {p.rev.toLocaleString()} reviews</span></div>
//           </div>
//         </div>

//         <div className="p-6 flex flex-col md:flex-row gap-5 overflow-y-auto">
//           <div className="flex-1 flex flex-col gap-3">
//             <div className="bg-slate-50 rounded-2xl p-4">
//               <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">About</p>
//               <p className="text-sm text-slate-600 leading-relaxed">{p.detail}</p>
//             </div>
//             <div className="bg-emerald-50 rounded-2xl p-4">
//               <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">Key Ingredients</p>
//               <p className="text-sm text-slate-600">{p.ingredients}</p>
//             </div>
//             <button onClick={()=>onWishlist(p)} className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-all w-fit ${wishlisted?"border-rose-300 text-rose-500 bg-rose-50":"border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-400"}`}>
//               {wishlisted?"❤️ Wishlisted":"🤍 Add to Wishlist"}
//             </button>
//           </div>

//           <div className="md:w-44 flex flex-col gap-3 flex-shrink-0">
//             <div>
//               <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Price</p>
//               <div className="flex items-baseline gap-2">
//                 <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl font-bold text-emerald-800">₹{(p.price || 0).toLocaleString()}</span>
//                 <span className="text-xs text-slate-400 line-through">₹{(p.mrp || 0).toLocaleString()}</span>
//               </div>
//               <p className="text-[11px] text-emerald-600 font-medium mt-0.5">✓ Free delivery on ₹999+</p>
//             </div>
//             <div>
//               <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Qty</p>
//               <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-3 py-2 w-fit">
//                 <button onClick={()=>setQty(Math.max(1,qty-1))} className="w-7 h-7 rounded-full bg-white shadow text-slate-600 hover:text-emerald-600 font-bold text-lg leading-none flex items-center justify-center">−</button>
//                 <span className="font-semibold w-4 text-center text-sm">{qty}</span>
//                 <button onClick={()=>setQty(qty+1)} className="w-7 h-7 rounded-full bg-white shadow text-slate-600 hover:text-emerald-600 font-bold text-lg leading-none flex items-center justify-center">+</button>
//               </div>
//             </div>
//             <div className="bg-emerald-50 rounded-2xl p-3">
//               <p className="text-xs text-emerald-400 uppercase">Total</p>
//               <p style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-700">₹{(p.price*qty).toLocaleString()}</p>
//             </div>
//             <button onClick={add} className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95 ${added?"bg-green-500 text-white shadow-lg":"bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:-translate-y-0.5"}`}>
//               {added?"✓ Added!":"🛒 Add to Cart"}
//             </button>
//             <button onClick={onClose} className="w-full py-2.5 rounded-2xl text-xs text-slate-500 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 transition-colors">Continue Shopping</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





function ProductModal({p,onClose,onAddToCart,onWishlist,wishlisted}){
  const [qty,setQty]=useState(1);
  const [added,setAdded]=useState(false);
  
  // Safe variables taaki crash na ho
  const price = p.price || 0;
  const mrp = p.mrp || 0;
  const rating = p.rating || 5;
  const reviews = p.rev || 0;
  const disc = mrp > 0 ? Math.round((1 - price / mrp) * 100) : 0;

  function add(){onAddToCart(p,qty);setAdded(true);setTimeout(()=>setAdded(false),2000);}
  
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:"rgba(0,0,0,.55)",backdropFilter:"blur(8px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden bi max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 flex gap-5 items-start relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/60 transition-all">✕</button>
          
          <div className="w-28 h-28 rounded-2xl bg-white/80 shadow-sm flex items-center justify-center text-6xl fl flex-shrink-0">
             {p.image_url ? <img src={p.image_url} className="w-full h-full object-contain p-2" /> : (p.emoji || "🧴")}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <Chip text={p.tag || "New"} color="green"/><Chip text={p.cat || "Skincare"} color="teal"/><Chip text={disc+"% OFF"} color="amber"/>
            </div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-950 leading-tight">{p.name || "Product Name"}</h2>
            <p className="text-slate-500 text-xs mt-1">{p.ml || "100ml"} · Prottiva Nutrition</p>
            <div className="flex items-center gap-2 mt-2">
                <Stars r={rating}/>
                <span className="text-xs text-slate-500">{rating} · {reviews.toLocaleString()} reviews</span>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-5 overflow-y-auto scrollbar-hide">
          <div className="flex-1 flex flex-col gap-3">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">About</p>
              <p className="text-sm text-slate-600 leading-relaxed">{p.detail || p.desc || "No details available."}</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">Key Ingredients</p>
              <p className="text-sm text-slate-600">{p.ingredients || "Science-backed actives."}</p>
            </div>
          </div>

          <div className="md:w-44 flex flex-col gap-3 flex-shrink-0">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Price</p>
              <div className="flex items-baseline gap-2">
                <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl font-bold text-emerald-800">₹{price.toLocaleString()}</span>
                {mrp > price && <span className="text-xs text-slate-400 line-through">₹{mrp.toLocaleString()}</span>}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Qty</p>
              <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-3 py-2 w-fit">
                <button onClick={()=>setQty(Math.max(1,qty-1))} className="w-7 h-7 rounded-full bg-white shadow text-slate-600 font-bold flex items-center justify-center">−</button>
                <span className="font-semibold w-4 text-center text-sm">{qty}</span>
                <button onClick={()=>setQty(qty+1)} className="w-7 h-7 rounded-full bg-white shadow text-slate-600 font-bold flex items-center justify-center">+</button>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-3">
              <p className="text-xs text-emerald-400 uppercase">Total</p>
              <p style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-700">₹{(price * qty).toLocaleString()}</p>
            </div>
            <button onClick={add} className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all active:scale-95 ${added?"bg-green-500 text-white shadow-lg":"bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"}`}>
              {added?"✓ Added!":"🛒 Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}







/* ─── AI Skin Test ───────────────────────────────────────── */
function SkinTestPage({onBuy}){
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({});
  const [imgData,setImgData]=useState(null);
  const [imgPreview,setImgPreview]=useState(null);
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const fileRef=useRef();

  function pick(id,val){setAnswers(a=>({...a,[id]:val}));}

  function onFile(e){
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      setImgPreview(ev.target.result);
      setImgData(ev.target.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  async function analyse(){
    setLoading(true);setErr("");
    const summary=SKIN_Q.map(q=>`${q.q} → ${answers[q.id]||"Not answered"}`).join("\n");
    const hasImage=!!imgData;

    const userContent = hasImage ? [
      {type:"image",source:{type:"base64",media_type:"image/jpeg",data:imgData}},
      {type:"text",text:`You are an expert AI dermatologist for Prottiva Nutrition, a science-backed Indian skincare brand.
Analyse this selfie/skin photo AND the quiz answers below to provide a detailed skin analysis.
Quiz answers:\n${summary}
Return ONLY this JSON (no markdown, no extra text):
{"skinType":"Oily|Dry|Combination|Normal|Sensitive","skinScore":75,"headline":"Short catchy headline max 10 words","topConcerns":["concern1","concern2","concern3"],"routine":{"morning":["step1","step2","step3"],"evening":["step1","step2","step3"]},"ingredientsToSeek":["ing1","ing2","ing3","ing4"],"ingredientsToAvoid":["ing1","ing2"],"lifestyleTip":"One practical tip sentence","imageObservation":"Brief 1-sentence observation from the photo","recommendedProductIds":[1,2,3]}`}
    ] : `You are an expert AI dermatologist for Prottiva Nutrition, a science-backed Indian skincare brand.
Based on quiz answers:\n${summary}
Return ONLY this JSON (no markdown):
{"skinType":"Oily|Dry|Combination|Normal|Sensitive","skinScore":75,"headline":"Short catchy headline max 10 words","topConcerns":["concern1","concern2","concern3"],"routine":{"morning":["step1","step2","step3"],"evening":["step1","step2","step3"]},"ingredientsToSeek":["ing1","ing2","ing3","ing4"],"ingredientsToAvoid":["ing1","ing2"],"lifestyleTip":"One practical tip sentence","recommendedProductIds":[1,2,3]}`;

    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:userContent}]})});
      const data=await res.json();
      const text=data.content?.map(c=>c.text||"").join("")||"";
      const clean=text.replace(/```json|```/g,"").trim();
      setResult(JSON.parse(clean));
      setStep(7);
    }catch(e){setErr("Analysis failed — please try again.");setStep(6);}
    setLoading(false);
  }

  const recP=result?PRODUCTS.filter(p=>result.recommendedProductIds?.includes(p.id)).slice(0,3):[];

  /* Intro */
  if(step===0) return(
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-28 pb-16 px-4 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full text-center fu">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl shadow-emerald-200 fl">🔬</div>
        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Powered by Claude AI</span>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl md:text-5xl font-bold text-emerald-950 mb-4 leading-tight">AI Skin Analysis<br/><span className="italic text-emerald-600">Personalised for you</span></h1>
        <p className="text-slate-600 text-base leading-relaxed mb-8">Answer 5 questions + optionally upload a selfie. Our AI dermatologist analyses your unique skin profile and recommends the right Prottiva products.</p>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[["⏱️","2 minutes"],["📸","Photo analysis"],["🎁","Free & personalised"]].map(([e,t])=>(
            <div key={t} className="bg-white rounded-2xl p-3 shadow-sm border border-emerald-100"><div className="text-2xl mb-1">{e}</div><p className="text-xs font-medium text-slate-600">{t}</p></div>
          ))}
        </div>
        <button onClick={()=>setStep(1)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base px-10 py-4 rounded-full shadow-xl shadow-emerald-200 hover:-translate-y-0.5 transition-all active:scale-95">
          Start Free Skin Test →
        </button>
      </div>
    </div>
  );

  /* Questions */
  if(step>=1&&step<=5){
    const q=SKIN_Q[step-1];
    return(
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full fu">
          <div className="mb-8">
            <div className="flex justify-between text-xs text-slate-400 font-medium mb-2"><span>Question {step} of 5</span><span>{Math.round((step/5)*100)}%</span></div>
            <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500" style={{width:(step/5*100)+"%"}}/></div>
          </div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl md:text-3xl font-bold text-emerald-950 mb-6">{q.q}</h2>
          <div className="flex flex-col gap-3">
            {q.opts.map(o=>(
              <button key={o} onClick={()=>pick(q.id,o)} className={`text-left px-5 py-4 rounded-2xl border-2 text-sm font-medium transition-all ${answers[q.id]===o?"border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm":"border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"}`}>
                {answers[q.id]===o?"✓ ":""}{o}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-8">
            {step>1&&<button onClick={()=>setStep(s=>s-1)} className="px-6 py-3 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:border-emerald-300 transition-all">← Back</button>}
            <button disabled={!answers[q.id]} onClick={()=>setStep(s=>s+1)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-full transition-all disabled:opacity-40 active:scale-95">
              {step===5?"Next →":"Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* Photo upload step */
  if(step===6) return(
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white pt-28 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-lg w-full fu">
        <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl font-bold text-emerald-950 mb-2 text-center">Upload a Selfie <span className="italic text-emerald-600">(Optional)</span></h2>
        <p className="text-slate-500 text-sm text-center mb-8">Our AI can analyse your actual skin for a more accurate report. Your photo is processed securely and never stored.</p>

        <div onClick={()=>fileRef.current.click()} className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all mb-6 ${imgPreview?"border-emerald-400 bg-emerald-50":"border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50"}`}>
          {imgPreview?(
            <div className="flex flex-col items-center gap-3">
              <img src={imgPreview} alt="Skin preview" className="w-40 h-40 object-cover rounded-2xl shadow-lg"/>
              <p className="text-emerald-600 font-semibold text-sm">✓ Photo ready — AI will analyse this</p>
              <button onClick={e=>{e.stopPropagation();setImgPreview(null);setImgData(null);}} className="text-xs text-rose-400 hover:text-rose-600 underline">Remove</button>
            </div>
          ):(
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-4xl">📸</div>
              <p className="font-medium text-slate-600">Tap to upload a selfie or skin close-up</p>
              <p className="text-xs">JPG, PNG · Max 5 MB · Front-facing recommended</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile}/>
        </div>

        {err&&<p className="text-rose-500 text-sm bg-rose-50 px-4 py-3 rounded-2xl mb-4 text-center">{err}</p>}

        <div className="flex gap-3">
          <button onClick={()=>setStep(5)} className="px-6 py-3 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:border-emerald-300 transition-all">← Back</button>
          <button onClick={analyse} disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-full transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-emerald-200">
            {loading?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full sp inline-block"/>Analysing skin…</>:"🔬 Analyse My Skin"}
          </button>
        </div>
        <button onClick={analyse} disabled={loading} className="w-full text-center text-xs text-emerald-600 hover:underline mt-3 transition-colors disabled:opacity-40">
          Skip photo & analyse quiz only →
        </button>
      </div>
    </div>
  );

  /* Result */
  if(step===7&&result) return(
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Score hero */}
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
              {result.imageObservation&&<p className="text-emerald-100 text-sm bg-white/10 px-3 py-1.5 rounded-full inline-block mb-1">📸 {result.imageObservation}</p>}
              <p className="text-emerald-200 text-sm mt-1">💡 {result.lifestyleTip}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {/* Concerns */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 fu d1">
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-900 mb-4">🎯 Top Concerns</h3>
            {result.topConcerns?.map(c=>(
              <div key={c} className="flex items-center gap-2.5 text-sm text-slate-700 bg-rose-50 px-4 py-2.5 rounded-xl mb-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0"/>{c}
              </div>
            ))}
          </div>
          {/* Ingredients */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 fu d2">
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-900 mb-4">🌿 Ingredient Guide</h3>
            <p className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold mb-2">Seek these:</p>
            <div className="flex flex-wrap gap-1.5 mb-4">{result.ingredientsToSeek?.map(i=><span key={i} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">{i}</span>)}</div>
            <p className="text-[10px] uppercase tracking-widest text-rose-500 font-bold mb-2">Avoid these:</p>
            <div className="flex flex-wrap gap-1.5">{result.ingredientsToAvoid?.map(i=><span key={i} className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full font-medium">{i}</span>)}</div>
          </div>
          {/* Routine */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 fu d3 md:col-span-2">
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-900 mb-4">📋 Your Personalised Routine</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[["☀️ Morning",result.routine?.morning||[]],["🌙 Evening",result.routine?.evening||[]]].map(([t,steps])=>(
                <div key={t} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4">
                  <p className="font-semibold text-emerald-800 mb-3 text-sm">{t}</p>
                  {steps.map((s,i)=>(
                    <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700 mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>{s}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended products */}
        {recP.length>0&&(
          <div className="fu d4">
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-900 mb-5">✨ Recommended For You</h3>
            <div className="grid sm:grid-cols-3 gap-5">
              {recP.map(p=>(
                <div key={p.id} className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-100 card-hover">
                  <div className="h-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-5xl mb-3">{p.emoji}</div>
                  <Chip text={p.tag} color="green"/>
                  <h4 style={{fontFamily:"'Cormorant Garamond',serif"}} className="font-bold text-emerald-900 mt-2 mb-1 text-lg leading-snug">{p.name}</h4>
                  <p className="text-xs text-slate-500 mb-3">{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-700">₹{p.price}</span>
                    <button onClick={()=>onBuy(p)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all active:scale-95">Buy Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="text-center mt-10">
          <button onClick={()=>{setStep(0);setAnswers({});setResult(null);setImgData(null);setImgPreview(null);}} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium underline underline-offset-4">Retake the skin test</button>
        </div>
      </div>
    </div>
  );

  return null;
}

/* ─── Cart Page ──────────────────────────────────────────── */
function CartPage({cart,setCart,setPage}){
  function remove(id){setCart(c=>c.filter(i=>i.p.id!==id));}
  function upQty(id,delta){setCart(c=>c.map(i=>i.p.id===id?{...i,qty:Math.max(1,i.qty+delta)}:i));}
  const subtotal=cart.reduce((a,i)=>a+i.p.price*i.qty,0);
  const shipping=subtotal>=999?0:99;
  const total=subtotal+shipping;

  return(
    <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
      <div className="mb-8 fu">
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl font-bold text-emerald-950">Shopping Cart</h1>
        <p className="text-slate-500 mt-1">{cart.length} item{cart.length!==1?"s":""}</p>
      </div>

      {cart.length===0?(
        <div className="text-center py-24 fu">
          <div className="text-7xl mb-4">🛒</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-slate-700 mb-2">Your cart is empty</h2>
          <p className="text-slate-400 mb-6">Add some products to get started</p>
          <button onClick={()=>setPage("Shop")} className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-emerald-700 transition-all active:scale-95">Shop Now</button>
        </div>
      ):(
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map(({p,qty})=>(
              <div key={p.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center gap-5 fu">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center text-4xl flex-shrink-0">{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="font-bold text-emerald-950 text-lg leading-snug">{p.name}</h3>
                  <p className="text-xs text-slate-400">{p.ml}</p>
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
                <div className="flex justify-between text-slate-600"><span>Subtotal ({cart.length} items)</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-slate-600"><span>Shipping</span><span className={shipping===0?"text-emerald-600 font-medium":""}>{shipping===0?"FREE":"₹"+shipping}</span></div>
                {shipping>0&&<p className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">Add ₹{(999-subtotal).toLocaleString()} more for free shipping!</p>}
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

/* ─── Checkout / Card Payment Page ──────────────────────── */
function CheckoutPage({cart,setCart,setPage,addPoints}){
  const [step,setStep]=useState(1); // 1=address, 2=payment, 3=success
  const [addr,setAddr]=useState({name:"",phone:"",email:"",address:"",city:"",state:"",pincode:""});
  const [card,setCard]=useState({num:"",name:"",expiry:"",cvv:""});
  const [method,setMethod]=useState("card");
  const [loading,setLoading]=useState(false);
  const [addrErr,setAddrErr]=useState("");
  const [cardErr,setCardErr]=useState("");

  const subtotal=cart.reduce((a,i)=>a+i.p.price*i.qty,0);
  const shipping=subtotal>=999?0:99;
  const total=subtotal+shipping;
  const pointsEarned=Math.floor(total/10);

  function chA(e){setAddr(x=>({...x,[e.target.name]:e.target.value}));setAddrErr("");}
  function chC(e){
    let v=e.target.value;
    if(e.target.name==="num") v=v.replace(/\D/g,"").slice(0,16).replace(/(\d{4})/g,"$1 ").trim();
    if(e.target.name==="expiry") v=v.replace(/\D/g,"").slice(0,4).replace(/(\d{2})(\d)/,"$1/$2");
    if(e.target.name==="cvv") v=v.replace(/\D/g,"").slice(0,3);
    setCard(x=>({...x,[e.target.name]:v}));setCardErr("");
  }

  function nextStep(){
    if(step===1){
      if(!addr.name||!addr.phone||!addr.email||!addr.address||!addr.city||!addr.pincode){setAddrErr("Please fill all required fields.");return;}
      setStep(2);
    }
  }

  async function pay(e){
    e.preventDefault();
    if(method==="card"){
      if(card.num.replace(/\s/g,"").length<16||!card.name||card.expiry.length<5||card.cvv.length<3){setCardErr("Please enter valid card details.");return;}
    }
    setLoading(true);
    await new Promise(r=>setTimeout(r,2000));
    setLoading(false);
    addPoints(pointsEarned);
    setCart([]);
    setStep(3);
  }

  if(step===3) return(
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white pt-28 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center bi">
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl shadow-emerald-200">✅</div>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl font-bold text-emerald-900 mb-2">Order Confirmed!</h2>
        <p className="text-slate-600 mb-3">Thank you, <strong>{addr.name}</strong>! Your order has been placed successfully.</p>
        <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-100">
          <p className="text-emerald-700 font-semibold text-sm mb-1">🎁 You earned {pointsEarned} Prottiva Points!</p>
          <p className="text-xs text-emerald-600">Points can be redeemed on your next purchase</p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Order Details</p>
          <p className="text-sm text-slate-700">📦 Estimated delivery: <strong>3–5 business days</strong></p>
          <p className="text-sm text-slate-700 mt-1">📧 Confirmation sent to: <strong>{addr.email}</strong></p>
          <p className="text-sm font-bold text-emerald-700 mt-2">Total Paid: ₹{total.toLocaleString()}</p>
        </div>
        <button onClick={()=>setPage("Shop")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all active:scale-95">Continue Shopping →</button>
      </div>
    </div>
  );

  return(
    <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
      <div className="mb-8">
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl font-bold text-emerald-950">Checkout</h1>
        {/* Steps */}
        <div className="flex items-center gap-3 mt-4">
          {["Delivery","Payment"].map((s,i)=>(
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step>i+1?"bg-emerald-600 text-white":step===i+1?"bg-emerald-600 text-white":"bg-slate-200 text-slate-400"}`}>{step>i+1?"✓":i+1}</div>
              <span className={`text-sm font-medium ${step>=i+1?"text-emerald-700":"text-slate-400"}`}>{s}</span>
              {i<1&&<div className="w-8 h-px bg-slate-200 mx-1"/>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step===1&&(
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm fu">
              <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-950 mb-5">📦 Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name*" name="name" value={addr.name} onChange={chA} placeholder="Anika Sharma"/>
                <Input label="Phone*" name="phone" type="tel" value={addr.phone} onChange={chA} placeholder="+91 98765 43210"/>
                <div className="sm:col-span-2"><Input label="Email*" name="email" type="email" value={addr.email} onChange={chA} placeholder="anika@email.com"/></div>
                <div className="sm:col-span-2"><Input label="Address*" name="address" value={addr.address} onChange={chA} placeholder="Flat / House no, Street, Area"/></div>
                <Input label="City*" name="city" value={addr.city} onChange={chA} placeholder="Bangalore"/>
                <Input label="State" name="state" value={addr.state} onChange={chA} placeholder="Karnataka"/>
                <Input label="PIN Code*" name="pincode" value={addr.pincode} onChange={chA} placeholder="560034"/>
              </div>
              {addrErr&&<p className="text-rose-500 text-sm bg-rose-50 px-4 py-2 rounded-xl mt-4">{addrErr}</p>}
              <button onClick={nextStep} className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-200">
                Continue to Payment →
              </button>
            </div>
          )}

          {step===2&&(
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm fu">
              <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-950 mb-5">💳 Payment</h2>

              {/* Payment method selector */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[["card","💳 Card"],["upi","📱 UPI"],["cod","🏠 COD"]].map(([m,l])=>(
                  <button key={m} onClick={()=>setMethod(m)} className={`py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${method===m?"border-emerald-500 bg-emerald-50 text-emerald-700":"border-slate-200 text-slate-500 hover:border-emerald-300"}`}>{l}</button>
                ))}
              </div>

              <form onSubmit={pay}>
                {method==="card"&&(
                  <div className="flex flex-col gap-4">
                    {/* Card visual */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-5 text-white shadow-xl shadow-emerald-200 mb-2">
                      <div className="flex justify-between items-start mb-8">
                        <Logo h={28}/>
                        <span className="text-sm font-bold opacity-80">VISA</span>
                      </div>
                      <p className="text-lg font-mono tracking-widest mb-4">{card.num||"•••• •••• •••• ••••"}</p>
                      <div className="flex justify-between text-xs">
                        <div><p className="opacity-60 mb-0.5">CARD HOLDER</p><p className="font-semibold uppercase">{card.name||"YOUR NAME"}</p></div>
                        <div><p className="opacity-60 mb-0.5">EXPIRES</p><p className="font-semibold">{card.expiry||"MM/YY"}</p></div>
                      </div>
                    </div>
                    <Input label="Card Number" name="num" value={card.num} onChange={chC} placeholder="1234 5678 9012 3456"/>
                    <Input label="Cardholder Name" name="name" value={card.name} onChange={chC} placeholder="ANIKA SHARMA"/>
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Expiry" name="expiry" value={card.expiry} onChange={chC} placeholder="MM/YY"/>
                      <Input label="CVV" name="cvv" value={card.cvv} onChange={chC} placeholder="•••"/>
                    </div>
                  </div>
                )}
                {method==="upi"&&(
                  <div className="text-center py-8">
                    <div className="w-32 h-32 bg-slate-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <div className="text-5xl">📱</div>
                    </div>
                    <p className="text-slate-600 font-medium mb-2">Pay via UPI</p>
                    <Input label="UPI ID" name="upi" value={""} onChange={()=>{}} placeholder="yourname@upi"/>
                  </div>
                )}
                {method==="cod"&&(
                  <div className="bg-amber-50 rounded-2xl p-6 text-center border border-amber-100">
                    <div className="text-5xl mb-3">🏠</div>
                    <p className="font-semibold text-amber-800">Cash on Delivery</p>
                    <p className="text-sm text-amber-600 mt-1">Pay ₹{total.toLocaleString()} when your order arrives. Additional ₹30 COD fee applies.</p>
                  </div>
                )}
                {cardErr&&<p className="text-rose-500 text-sm bg-rose-50 px-4 py-2 rounded-xl mt-3">{cardErr}</p>}
                <button type="submit" disabled={loading} className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-60 flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 active:scale-95 text-base">
                  {loading?<><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full sp inline-block"/>Processing…</>:<>🔒 Pay ₹{total.toLocaleString()} Securely</>}
                </button>
                <p className="text-xs text-slate-400 text-center mt-3">🔒 256-bit SSL encryption · PCI DSS compliant</p>
              </form>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm sticky top-28">
            <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-lg font-bold text-emerald-950 mb-4">Your Order</h3>
            <div className="flex flex-col gap-3 mb-4 max-h-52 overflow-y-auto scrollbar-hide">
              {cart.map(({p,qty})=>(
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl flex-shrink-0">{p.emoji}</div>
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
              <p className="text-xs text-emerald-600 font-semibold">🎁 You will earn <strong>{pointsEarned} Prottiva Points</strong> on this order!</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─── Wishlist Page ──────────────────────────────────────── */
function WishlistPage({wishlist,onWishlist,onBuy}){
  return(
    <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
      <div className="mb-8 fu">
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl font-bold text-emerald-950">My Wishlist</h1>
        <p className="text-slate-500 mt-1">{wishlist.length} item{wishlist.length!==1?"s":""} saved</p>
      </div>
      {wishlist.length===0?(
        <div className="text-center py-24 fu">
          <div className="text-7xl mb-4">🤍</div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-slate-700 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-400">Save products you love for later</p>
        </div>
      ):(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlist.map(p=>(
            <ProductCard key={p.id} p={p} onBuy={onBuy} onWishlist={onWishlist} wishlisted={true}/>
          ))}
        </div>
      )}
    </main>
  );
}

/* ─── Home Page ──────────────────────────────────────────── */
function HomePage({setPage,onBuy,onWishlist,wishlist, products}){
  const testimonials=[
    {name:"Priya S.",loc:"Mumbai",text:"Hydra Boost Serum transformed my dry skin in 2 weeks. My face feels like glass!",rating:5,emoji:"👩"},
    {name:"Rahul M.",loc:"Delhi",text:"The AI skin test recommended the perfect routine for my oily skin. Acne is gone!",rating:5,emoji:"👨"},
    {name:"Anita K.",loc:"Bangalore",text:"Best skincare brand I've tried. Vitamin C serum gave me the glow I was looking for.",rating:5,emoji:"👩‍💼"},
  ];
  return(
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
            <div className="flex flex-wrap gap-4 mb-8">
              <button onClick={()=>setPage("Shop")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-full shadow-xl shadow-emerald-200 hover:-translate-y-0.5 transition-all active:scale-95">Shop Now →</button>
              <button onClick={()=>setPage("Skin Test")} className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-4 rounded-full transition-all active:scale-95">🔬 Free AI Skin Test</button>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {["🌿 Vegan","🔬 Dermatologist Tested","🇮🇳 Made in India","🐰 Cruelty-free"].map(b=>(
                <span key={b} className="text-sm text-slate-500 font-medium">{b}</span>
              ))}
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center fu d3">
            <div className="relative">
              <div className="w-72 h-72 lg:w-88 lg:h-88 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center text-9xl fl shadow-2xl shadow-emerald-200" style={{width:"340px",height:"340px"}}>🌿</div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-emerald-100 fu d1">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Skin Score</p>
                <p style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl font-bold text-emerald-700">92/100</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-emerald-100 fu d2">
                <p className="text-xs text-slate-400">Happy Customers</p>
                <p style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-800">50,000+</p>
              </div>
              <div className="absolute top-1/3 -right-14 bg-emerald-600 rounded-2xl shadow-xl p-3 text-white fu d3">
                <p className="text-xs font-bold">⭐ 4.8 Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Skin Test Banner */}
      <section className="bg-gradient-to-r from-emerald-700 to-teal-700 py-14 px-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <span className="inline-block bg-white/20 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">🤖 AI-Powered · Free · 2 Minutes</span>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl md:text-4xl font-bold mb-4">Not sure what your skin needs?</h2>
          <p className="text-emerald-100 mb-7 max-w-xl mx-auto">Upload a selfie + answer 5 questions. Our AI dermatologist will build your personalised skincare routine.</p>
          <button onClick={()=>setPage("Skin Test")} className="bg-white text-emerald-700 font-bold px-10 py-4 rounded-full hover:bg-emerald-50 shadow-xl transition-all hover:-translate-y-0.5 active:scale-95">
            🔬 Take Free AI Skin Test →
          </button>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-emerald-500 text-xs uppercase tracking-widest font-bold mb-1">Best Sellers</p>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl md:text-4xl font-bold text-emerald-950">Loved by 50,000+ customers</h2>
          </div>
          <button onClick={()=>setPage("Shop")} className="hidden sm:block text-emerald-600 font-semibold text-sm hover:underline">View all →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0,4).map((p,i)=>(
            <div key={p.id} style={{animationDelay:(i*0.08)+"s"}} className="fu">
              <ProductCard p={p} onBuy={onBuy} onWishlist={onWishlist} wishlisted={wishlist.some(w=>w.id===p.id)}/>
            </div>
          ))}



        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-emerald-950 to-teal-950 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl md:text-4xl font-bold text-white">What our customers say</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t,i)=>(
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

      {/* Why Prottiva */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-3xl md:text-4xl font-bold text-emerald-950">Why <span className="italic text-emerald-600">Prottiva</span> is different</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[{e:"🧬",t:"Nutrition-Driven",d:"Every formula backed by nutritional science, not trends."},{e:"🔬",t:"Clinically Tested",d:"Tested with dermatologists before reaching your shelf."},{e:"🌿",t:"Clean Actives",d:"No sulphates, parabens, or harmful fillers — ever."},{e:"🤖",t:"AI Personalised",d:"AI skin test matches you to the right products."}].map((v,i)=>(
            <div key={v.t} style={{animationDelay:(i*0.08)+"s"}} className="fu bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-100 card-hover text-center">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">{v.e}</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-lg font-bold text-emerald-900 mb-2">{v.t}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ─── Shop Page ──────────────────────────────────────────── */
function ShopPage({onBuy,onWishlist,wishlist, products}){
  const [cat,setCat]=useState("All");
  const [sort,setSort]=useState("default");
  const [search,setSearch]=useState("");
  const filtered=(cat==="All"?products:products.filter(p=>p.cat===cat))
    .filter(p=>!search||p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>sort==="low"?a.price-b.price:sort==="high"?b.price-a.price:sort==="rating"?b.rating-a.rating:0);

  return(
    <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-8 fu">
        <p className="text-emerald-500 text-xs uppercase tracking-widest font-bold mb-1">Prottiva Nutrition</p>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl font-bold text-emerald-950">Shop All Products</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…" className="border border-slate-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-emerald-400 bg-white w-full sm:w-64"/>
        <div className="flex flex-wrap gap-2 flex-1">
          {CATS.map(c=>(
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((p,i)=>(
          <div key={p.id} style={{animationDelay:(i*0.04)+"s"}} className="fu">
            <ProductCard p={p} onBuy={onBuy} onWishlist={onWishlist} wishlisted={wishlist.some(w=>w.id===p.id)}/>
          </div>
        ))}
      </div>
    </main>
  );
}

/* ─── About Page ─────────────────────────────────────────── */
function AboutPage(){
  const team=[{name:"Dr. Priya Nair",role:"Co-Founder & Chief Dermatologist",emoji:"👩‍⚕️"},{name:"Arjun Mehra",role:"Formulation Scientist",emoji:"👨‍🔬"},{name:"Sneha Pillai",role:"Head of AI Research",emoji:"👩‍💻"}];
  return(
    <main className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto text-center mb-16 fu">
        <span className="text-emerald-500 text-xs uppercase tracking-widest font-bold">Our Story</span>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-4xl md:text-5xl font-bold text-emerald-950 mt-2 mb-4 leading-tight">Skincare built on <span className="italic text-emerald-600">nutrition & truth</span></h1>
        <p className="text-slate-600 text-lg leading-relaxed">Prottiva Nutrition was founded in 2021 by a dermatologist and a nutritional biochemist who believed the industry was overcomplicating the wrong things — and ignoring the science that actually works.</p>
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

/* ─── Contact Page ───────────────────────────────────────── */
function ContactPage(){
  const [f,setF]=useState({name:"",email:"",subject:"",msg:""});
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false);
  function ch(e){setF(x=>({...x,[e.target.name]:e.target.value}));}
  async function sub(e){
    e.preventDefault();
    if(!f.name||!f.email||!f.msg)return;
    setLoading(true);await new Promise(r=>setTimeout(r,1000));setLoading(false);setSent(true);
  }
  return(
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
            {sent?(
              <div className="text-center py-10">
                <div className="text-6xl mb-4">✅</div>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-2xl font-bold text-emerald-800 mb-2">Message Sent!</h3>
                <p className="text-slate-500">We'll get back to you within 24 hours.</p>
                <button onClick={()=>setSent(false)} className="mt-5 text-emerald-600 underline text-sm">Send another</button>
              </div>
            ):(
              <form onSubmit={sub} className="flex flex-col gap-4">
                <h3 style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-900 mb-1">Send us a message</h3>
                <Input label="Full Name" name="name" value={f.name} onChange={ch} placeholder="Anika Sharma"/>
                <Input label="Email" name="email" type="email" value={f.email} onChange={ch} placeholder="you@email.com"/>
                <Input label="Subject" name="subject" value={f.subject} onChange={ch} placeholder="Order enquiry…"/>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Message</label>
                  <textarea name="msg" value={f.msg} onChange={ch} placeholder="Your message…" rows={4} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 resize-none"/>
                </div>
                <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95">
                  {loading&&<span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full sp inline-block"/>}
                  {loading?"Sending…":"Send Message →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer({setPage}){
  return(
    <footer className="bg-emerald-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Logo h={44}/>
          <p className="text-emerald-300 text-sm mt-4 leading-relaxed">Science-backed skincare nutrition. Made in India, for every skin type.</p>
          <div className="flex gap-3 mt-5">
            {["📘","📸","▶️","🐦"].map(s=>(
              <button key={s} className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-sm transition-colors">{s}</button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-emerald-100 mb-4 text-xs uppercase tracking-widest">Navigate</h4>
          <ul className="flex flex-col gap-2.5">
            {["Home","Shop","Skin Test","About","Contact"].map(l=>(
              <li key={l}><button onClick={()=>setPage(l)} className="text-emerald-300 hover:text-white text-sm transition-colors">{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-emerald-100 mb-4 text-xs uppercase tracking-widest">Support</h4>
          <ul className="flex flex-col gap-2.5 text-emerald-300 text-sm">
            {["Shipping Policy","Returns & Refunds","Track My Order","FAQs","Privacy Policy"].map(l=>(
              <li key={l}><button className="hover:text-white transition-colors">{l}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-emerald-100 mb-4 text-xs uppercase tracking-widest">Newsletter</h4>
          <p className="text-emerald-300 text-sm mb-3">Skincare tips &amp; exclusive offers.</p>
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

/* ─── Live Chat Widget ───────────────────────────────────── */
function LiveChat(){
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState([{from:"bot",text:"Hi! 👋 I'm Priya, your Prottiva skincare advisor. How can I help you today?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef();

  useEffect(()=>{if(endRef.current)endRef.current.scrollIntoView({behavior:"smooth"});},[msgs]);

  async function send(){
    if(!input.trim()||loading)return;
    const userMsg=input.trim();
    setInput("");
    setMsgs(m=>[...m,{from:"user",text:userMsg}]);
    setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:300,system:"You are Priya, a friendly skincare advisor for Prottiva Nutrition, an Indian science-backed skincare brand. Answer skincare and product questions concisely in 2-3 sentences. Be warm, helpful and knowledgeable. Mention Prottiva products when relevant.",messages:[...msgs.filter(m=>m.from==="user"||m._sent).map(m=>({role:m.from==="user"?"user":"assistant",content:m.text})),{role:"user",content:userMsg}]})});
      const data=await res.json();
      const text=data.content?.[0]?.text||"I'm sorry, I couldn't understand. Please try again!";
      setMsgs(m=>[...m,{from:"bot",text,_sent:true}]);
    }catch{
      setMsgs(m=>[...m,{from:"bot",text:"Sorry, I'm having trouble connecting. Please try again!",_sent:true}]);
    }
    setLoading(false);
  }

  return(
    <div className="fixed bottom-5 right-5 z-50">
      {open&&(
        <div className="mb-3 w-80 bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden si">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl">👩‍⚕️</div>
            <div><p className="text-white font-semibold text-sm">Priya · Skincare AI</p><p className="text-emerald-200 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"/>Online now</p></div>
            <button onClick={()=>setOpen(false)} className="ml-auto text-white/70 hover:text-white">✕</button>
          </div>
          <div className="h-64 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
            {msgs.map((m,i)=>(
              <div key={i} className={`flex ${m.from==="user"?"justify-end":"justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from==="user"?"bg-emerald-600 text-white rounded-br-sm":"bg-slate-100 text-slate-700 rounded-bl-sm"}`}>{m.text}</div>
              </div>
            ))}
            {loading&&<div className="flex justify-start"><div className="bg-slate-100 px-4 py-2.5 rounded-2xl rounded-bl-sm"><div className="flex gap-1">{[0,1,2].map(i=><span key={i} style={{animationDelay:i*0.2+"s"}} className="w-2 h-2 rounded-full bg-slate-400 pu inline-block"/>)}</div></div></div>}
            <div ref={endRef}/>
          </div>
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about your skin…" className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-emerald-400"/>
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

/* ─── Loyalty Points Banner ──────────────────────────────── */
function PointsBanner({points}){
  if(!points)return null;
  return(
    <div className="fixed top-20 right-4 z-40 bg-white border border-emerald-200 rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 si">
      <span className="text-2xl">🏆</span>
      <div><p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Prottiva Points</p><p style={{fontFamily:"'Cormorant Garamond',serif"}} className="text-xl font-bold text-emerald-900">{points.toLocaleString()} pts</p></div>
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────── */


//1st ye wala

// export default function App() {
//   const [page, setPage] = useState("Home");
//   const [cart, setCart] = useState([]);
//   const [wishlist, setWishlist] = useState([]);
//   const [modal, setModal] = useState(null);
//   const [authModal, setAuthModal] = useState(null);
//   const [user, setUser] = useState(null);
//   const [points, setPoints] = useState(0);
//   const [toast, setToast] = useState(null);

//   // --- YE DO NAYI STATES AUR EK EFFECT ADD KAREIN ---
//   const [products, setProducts] = useState([]); // Database products ke liye
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         // Aapka api.js jo port 8008 par set hai
//         const res = await api.get("/products"); 
//         setProducts(res.data.products); 
//       } catch (err) {
//         console.error("Backend connection error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []); 
// }


//2nd ye wala

export default function App() {
  const [page, setPage] = useState("Home");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [modal, setModal] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [toast, setToast] = useState(null);

  // --- Backend States ---
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- Fetch Products from Backend ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Aapka api.js jo port 8008 par set hai
        const res = await api.get("/products"); 
        setProducts(res.data.products); 
      } catch (err) {
        console.error("Backend connection error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  function navigate(p) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onBuy(p) { setModal(p); }

  function addToCart(p, qty) {
    setCart(c => {
      const ex = c.find(i => i.p.id === p.id);
      return ex ? c.map(i => i.p.id === p.id ? { ...i, qty: i.qty + qty } : i) : [...c, { p, qty }];
    });
    setModal(null);
    showToast("🛒 Added to cart!");
  }

  function onWishlist(p) {
    setWishlist(w => {
      const has = w.some(i => i.id === p.id);
      if (has) {
        showToast("🤍 Removed from wishlist");
        return w.filter(i => i.id !== p.id);
      } else {
        showToast("❤️ Added to wishlist!");
        return [...w, p];
      }
    });
  }

  function addPoints(n) { setPoints(x => x + n); }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar page={page} setPage={navigate} cart={cart} wishlist={wishlist} user={user} setAuthModal={setAuthModal} />

      {/* Loading state handles the UI until data arrives */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {page === "Home"     && <HomePage setPage={navigate} onBuy={onBuy} onWishlist={onWishlist} wishlist={wishlist} products={products} />}
          {page === "Shop"     && <ShopPage onBuy={onBuy} onWishlist={onWishlist} wishlist={wishlist} products={products} />}
          {page === "Skin Test" && <SkinTestPage onBuy={onBuy} products={products} />}
          {page === "About"    && <AboutPage />}
          {page === "Contact"  && <ContactPage />}
          {page === "Cart"     && <CartPage cart={cart} setCart={setCart} setPage={navigate} />}
          {page === "Checkout" && <CheckoutPage cart={cart} setCart={setCart} setPage={navigate} addPoints={addPoints} />}
          {page === "Wishlist" && <WishlistPage wishlist={wishlist} onWishlist={onWishlist} onBuy={onBuy} />}
        </>
      )}

      <Footer setPage={navigate} />

      {modal && <ProductModal p={modal} onClose={() => setModal(null)} onAddToCart={addToCart} onWishlist={onWishlist} wishlisted={wishlist.some(w => w.id === modal.id)} />}
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onAuth={n => { setUser(n); setAuthModal(null); showToast("👋 Welcome, " + n + "!"); }} />}

      <LiveChat />

      {points > 0 && <PointsBanner points={points} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-900/30 text-sm font-semibold animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}