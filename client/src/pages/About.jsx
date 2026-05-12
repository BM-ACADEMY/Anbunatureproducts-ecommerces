import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Leaf as LeafIcon, Heart, Baby, Sprout, Shield, Award, Smile, Handshake,
  TrendingUp, TreePine, UtensilsCrossed, Wheat, FlaskConical, Pill,
  Flag, Factory, Star, ClipboardList, Home, HeartHandshake, Salad,
  CheckCircle2
} from "lucide-react";

const useScrollInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return [ref, isInView];
};

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.1 }
  })
};

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

// ─── Leaf SVG ───────────────────────────────────────────────────────────────
const Leaf = ({ className = "", style = {} }) => (
  <svg viewBox="0 0 60 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 75 C30 75 5 55 5 30 C5 10 20 2 30 2 C40 2 55 10 55 30 C55 55 30 75 30 75Z" fill="currentColor" opacity="0.18"/>
    <path d="M30 75 L30 10" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
    <path d="M30 30 C20 25 12 28 8 32" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
    <path d="M30 45 C40 40 48 43 52 47" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
  </svg>
);

// ─── Floating Leaves Background ─────────────────────────────────────────────
const FloatingLeaves = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-green-600"
        style={{ left: `${10 + i * 12}%`, top: `${5 + (i % 3) * 25}%`, width: 32 + (i % 3) * 18 }}
        animate={{ y: [0, -18, 0], rotate: [0, 15, -10, 0], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 5 + i * 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
      >
        <Leaf />
      </motion.div>
    ))}
  </div>
);

// ─── Section Divider ────────────────────────────────────────────────────────
const Divider = () => (
  <div className="flex items-center justify-center gap-4 my-3">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-green-400" />
    <Leaf style={{ width: 22, color: "#4ade80" }} />
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-green-400" />
  </div>
);

// ─── Badge ──────────────────────────────────────────────────────────────────
const Badge = ({ icon, label }) => (
  <motion.div
    whileHover={{ scale: 1.07, y: -3 }}
    className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-5 py-4 shadow-lg cursor-default"
  >
    <span className="text-green-200">{icon}</span>
    <span className="text-xs font-semibold text-green-100 tracking-widest uppercase">{label}</span>
  </motion.div>
);

// ─── Certificate Card ────────────────────────────────────────────────────────
const CertCard = ({ icon, name, desc }) => (
  <motion.div
    whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(74,222,128,0.18)" }}
    className="flex flex-col items-center gap-3 bg-white rounded-2xl border border-green-100 shadow p-6 cursor-pointer transition-all"
  >
    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center shadow-inner text-green-600">{icon}</div>
    <div className="text-center">
      <div className="font-bold text-green-800 text-base">{name}</div>
      <div className="text-xs text-gray-500 mt-1">{desc}</div>
    </div>
    <div className="mt-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Certified ✓</div>
  </motion.div>
);

// ─── Timeline Item ───────────────────────────────────────────────────────────
const TimelineItem = ({ year, text, icon, i, isLast }) => {
  const [ref, inView] = useScrollInView();
  return (
    <motion.div ref={ref} variants={fadeUp} custom={i} initial="hidden" animate={inView ? "visible" : "hidden"}
      className="flex gap-5 items-start relative">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -45 }} animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 200 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xl shadow-lg z-10"
        >{icon}</motion.div>
        {!isLast && <div className="w-0.5 flex-1 bg-gradient-to-b from-green-400/60 to-transparent mt-1" style={{ minHeight: 48 }} />}
      </div>
      <div className="pb-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.15 + 0.3 }}
        >
          <span className="inline-block px-3 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold tracking-widest mb-2">{year}</span>
          <p className="text-gray-700 font-medium text-base leading-relaxed">{text}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─── Main About Page ─────────────────────────────────────────────────────────
export default function AnbuNaturalAbout() {
  // No scroll-based fade/parallax on hero

  const [missionRef, missionInView] = useScrollInView();
  const [differRef, differInView] = useScrollInView();
  const [visionRef, visionInView] = useScrollInView();
  const [timelineRef, timelineInView] = useScrollInView();
  const [certRef, certInView] = useScrollInView();
  const [trustRef, trustInView] = useScrollInView();
  const [careRef, careInView] = useScrollInView();
  const [commitRef, commitInView] = useScrollInView();

  const differentiators = [
    { icon: <LeafIcon size={32} className="text-green-600" />, title: "Natural & Carefully Selected Ingredients", desc: "Our products use carefully chosen herbs, traditional ingredients, and naturally inspired formulations — because nature provides powerful solutions." },
    { icon: <Heart size={32} className="text-rose-500" />, title: "Made with Care & Responsibility", desc: "We see customers as families who trust us. That trust motivates quality, honesty, and care in every step of our journey." },
    { icon: <Baby size={32} className="text-amber-500" />, title: "Family Wellness Focus", desc: "Designed with family wellness in mind — including women, children, and everyday household health needs from baby care to herbal wellness." },
    { icon: <Sprout size={32} className="text-emerald-500" />, title: "Traditional Wisdom Meets Modern Needs", desc: "We value traditional herbal knowledge while adapting products for today's lifestyle — making natural wellness practical and accessible." },
  ];

  const missions = [
    "Encourage healthier lifestyles through natural products",
    "Support families with affordable wellness solutions",
    "Promote traditional herbal knowledge",
    "Create products with honesty, care, and responsibility",
    "Grow as a socially responsible brand",
  ];

  const commitments = [
    { icon: <Award size={28} className="text-amber-500" />, text: "Quality-Focused Preparation" },
    { icon: <Smile size={28} className="text-green-500" />, text: "Customer Satisfaction" },
    { icon: <Handshake size={28} className="text-blue-500" />, text: "Honest Business Practices" },
    { icon: <TrendingUp size={28} className="text-emerald-500" />, text: "Continuous Improvement" },
    { icon: <TreePine size={28} className="text-green-600" />, text: "Natural Wellness Awareness" },
  ];

  const careItems = [
    { icon: <Salad size={28} className="text-green-300" />, label: "Child Nutrition Awareness" },
    { icon: <HeartHandshake size={28} className="text-green-300" />, label: "Women Wellness" },
    { icon: <Wheat size={28} className="text-green-300" />, label: "Rural Community Support" },
    { icon: <LeafIcon size={28} className="text-green-300" />, label: "Natural Health Awareness" },
    { icon: <Home size={28} className="text-green-300" />, label: "Support for Needy Families" },
  ];

  const trustBadges = [
    { icon: <Flag size={28} />, label: "Made in India" },
    { icon: <UtensilsCrossed size={28} />, label: "FSSAI Certified" },
    { icon: <Factory size={28} />, label: "MSME Registered" },
  ];

  const certs = [
    { icon: <UtensilsCrossed size={32} className="text-green-600" />, name: "FSSAI", desc: "Food Safety & Standards Authority of India" },
    { icon: <Factory size={32} className="text-green-600" />, name: "MSME", desc: "Ministry of Micro, Small & Medium Enterprises" },
    { icon: <Star size={32} className="text-green-600" />, name: "AGMARK", desc: "Agricultural Mark — Quality Guarantee" },
    { icon: <ClipboardList size={32} className="text-green-600" />, name: "ISO", desc: "Quality Management System Certified" },
  ];

  const timeline = [
    { year: "2024", text: "Started Anbu Natural with a dream to bring nature-based wellness to every home.", icon: <Sprout size={20} className="text-white" /> },
    { year: "2025", text: "Expanded our product range — herbal hair oils, millet health mixes, baby care, and more.", icon: <LeafIcon size={20} className="text-white" /> },
    { year: "2026", text: "Launching Anbu Care Trust — giving back with love through community wellness initiatives.", icon: <HeartHandshake size={20} className="text-white" /> },
  ];

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", background: "#f9fdf6" }} className="min-h-screen overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .sans { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f0fdf4; }
        ::-webkit-scrollbar-thumb { background: #4ade80; border-radius: 99px; }
        .green-glow { box-shadow: 0 0 40px 0 rgba(74,222,128,0.18); }
        .card-hover { transition: box-shadow 0.3s, transform 0.3s; }
        .card-hover:hover { box-shadow: 0 12px 40px 0 rgba(74,222,128,0.22); transform: translateY(-4px); }
      `}</style>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden py-20 md:py-28"
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #166534 100%)" }}>
        <FloatingLeaves />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.25)" }}>
            <Leaf style={{ width: 52, color: "#86efac" }} />
          </motion.div>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="sans text-green-300 tracking-[0.35em] text-xs uppercase mb-3 font-medium">About Us</motion.p>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="serif text-white text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{ textShadow: "0 2px 40px rgba(0,0,0,0.3)" }}>
            Anbu Natural
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="sans text-green-100 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            True wellness begins with nature. We're dedicated to creating natural, herbal, and wellness-based products that support healthier families and happier lifestyles.
          </motion.p>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="flex flex-wrap justify-center gap-4">
            {trustBadges.map((b, i) => (
              <motion.div key={b.label} variants={fadeUp} custom={i + 3}>
                <Badge icon={b.icon} label={b.label} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #4ade80 0%, transparent 70%)" }} />
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div ref={null} variants={slideLeft} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <p className="sans text-green-600 tracking-[0.3em] text-xs uppercase font-semibold mb-3">Our Story</p>
            <h2 className="serif text-4xl md:text-5xl font-bold text-gray-800 mb-5 leading-tight">Born from a<br /><span className="text-green-600 italic">Simple Dream</span></h2>
            <Divider />
            <p className="sans text-gray-600 leading-relaxed mt-6 text-base font-light">
              Anbu Natural was born from a simple dream — to create products that are closer to nature and safer for families.
              We started this journey with a desire to support healthier living using traditional ingredients, herbal knowledge, and natural wellness practices trusted for generations.
            </p>
            <p className="sans text-gray-600 leading-relaxed mt-4 text-base font-light">
              As a family-focused brand, we understand the importance of purity, care, and trust. That's why we focus on products that are simple, natural, and made with purpose. Every product reflects our belief that wellness should be accessible to everyone.
            </p>
          </motion.div>
          <motion.div variants={slideRight} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl opacity-10" style={{ background: "linear-gradient(135deg, #4ade80, #065f46)" }} />
              <div className="relative rounded-3xl p-8 border border-green-100 shadow-xl"
                style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}>
                {[
                  { icon: <LeafIcon size={22} className="text-green-600" />, label: "Herbal Hair Oils" },
                  { icon: <Wheat size={22} className="text-amber-600" />, label: "Millet Health Mixes" },
                  { icon: <FlaskConical size={22} className="text-orange-500" />, label: "Spice Powders & Premix" },
                  { icon: <Baby size={22} className="text-pink-500" />, label: "Baby Care Powders" },
                  { icon: <Pill size={22} className="text-emerald-500" />, label: "Wellness Products" },
                ].map((item, i) => (
                  <motion.div key={item.label} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="flex items-center gap-4 mb-4 last:mb-0">
                    <span>{item.icon}</span>
                    <span className="sans text-green-800 font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What Makes Us Different ── */}
      <section ref={differRef} className="py-24 px-6" style={{ background: "linear-gradient(to bottom, #f0fdf4, #f9fdf6)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate={differInView ? "visible" : "hidden"} className="text-center mb-16">
            <p className="sans text-green-600 tracking-[0.3em] text-xs uppercase font-semibold mb-3">Why Choose Us</p>
            <h2 className="serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">What Makes Us<br /><span className="text-green-600 italic">Different</span></h2>
            <Divider />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((d, i) => (
              <motion.div key={d.title} variants={fadeUp} custom={i} initial="hidden" animate={differInView ? "visible" : "hidden"}
                whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(74,222,128,0.18)" }}
                className="bg-white rounded-3xl p-7 border border-green-50 shadow-sm card-hover cursor-default">
                <div className="mb-4">{d.icon}</div>
                <h3 className="serif font-bold text-gray-800 text-xl mb-3 leading-tight">{d.title}</h3>
                <p className="sans text-gray-500 text-sm leading-relaxed font-light">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section ref={visionRef} className="py-24 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 60%, #14532d 100%)" }}>
        <FloatingLeaves />
        <div className="max-w-5xl mx-auto relative z-10 grid md:grid-cols-2 gap-14">
          <motion.div variants={slideLeft} initial="hidden" animate={visionInView ? "visible" : "hidden"}>
            <p className="sans text-green-300 tracking-[0.3em] text-xs uppercase font-semibold mb-3">Our Vision</p>
            <h2 className="serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Growing Together,<br /><span className="text-green-300 italic">Naturally</span></h2>
            <p className="sans text-green-100 text-base leading-relaxed font-light">
              To become a trusted natural wellness brand that brings healthier living, traditional goodness, and affordable herbal care to every home across India and beyond.
            </p>
          </motion.div>
          <motion.div ref={missionRef} variants={slideRight} initial="hidden" animate={visionInView ? "visible" : "hidden"}>
            <p className="sans text-green-300 tracking-[0.3em] text-xs uppercase font-semibold mb-3">Our Mission</p>
            <h2 className="serif text-4xl font-bold text-white mb-6 leading-tight">What We <span className="text-green-300 italic">Stand For</span></h2>
            <ul className="space-y-4">
              {missions.map((m, i) => (
                <motion.li key={m} variants={fadeUp} custom={i} initial="hidden" animate={missionInView ? "visible" : "hidden"}
                  className="flex items-start gap-3">
                  <span className="mt-1 w-5 h-5 rounded-full bg-green-400/30 border border-green-400/50 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 2.5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
                  </span>
                  <span className="sans text-green-100 font-light text-sm leading-relaxed">{m}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── Commitment ── */}
      <section ref={commitRef} className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate={commitInView ? "visible" : "hidden"}>
            <p className="sans text-green-600 tracking-[0.3em] text-xs uppercase font-semibold mb-3">Our Commitment</p>
            <h2 className="serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">Committed to<br /><span className="text-green-600 italic">Excellence</span></h2>
            <Divider />
          </motion.div>
          <div className="flex flex-wrap justify-center gap-5 mt-12">
            {commitments.map((c, i) => (
              <motion.div key={c.text} variants={fadeUp} custom={i} initial="hidden" animate={commitInView ? "visible" : "hidden"}
                whileHover={{ scale: 1.07, rotate: [0, -2, 2, 0] }}
                className="flex flex-col items-center gap-2 rounded-2xl px-6 py-5 shadow border border-green-100 bg-green-50/50 cursor-default min-w-[130px]">
                <span>{c.icon}</span>
                <span className="sans text-green-800 font-semibold text-sm text-center leading-tight">{c.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Badges ── */}
      <section ref={trustRef} className="py-24 px-6" style={{ background: "#f9fdf6" }}>
        <div className="max-w-5xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate={trustInView ? "visible" : "hidden"}>
            <p className="sans text-green-600 tracking-[0.3em] text-xs uppercase font-semibold mb-3">Our Trust</p>
            <h2 className="serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">Certified &amp;<br /><span className="text-green-600 italic">Trustworthy</span></h2>
            <Divider />
            <p className="sans text-gray-500 text-base font-light mt-6 mb-12 max-w-xl mx-auto">
              Every product we make is backed by certification, quality checks, and a deep sense of responsibility towards our customers.
            </p>
          </motion.div>
          {/* Trust Icon Row */}
          <motion.div variants={staggerContainer} initial="hidden" animate={trustInView ? "visible" : "hidden"}
            className="flex flex-wrap justify-center gap-8 mb-16">
            {[
              { icon: <Flag size={40} className="text-orange-500" />, title: "Made in India", sub: "Proudly Indian" },
              { icon: <UtensilsCrossed size={40} className="text-green-600" />, title: "FSSAI", sub: "Food Safe & Approved" },
              { icon: <Factory size={40} className="text-blue-600" />, title: "MSME", sub: "Govt. Registered" },
            ].map((t, i) => (
              <motion.div key={t.title} variants={fadeUp} custom={i}
                whileHover={{ y: -6, scale: 1.05 }}
                className="flex flex-col items-center gap-3 bg-white rounded-3xl px-10 py-8 border border-green-100 shadow-md green-glow cursor-default">
                <span>{t.icon}</span>
                <span className="serif font-bold text-gray-800 text-xl">{t.title}</span>
                <span className="sans text-green-600 text-xs tracking-widest uppercase">{t.sub}</span>
              </motion.div>
            ))}
          </motion.div>
          {/* Certificates */}
          <motion.div ref={certRef} variants={fadeUp} initial="hidden" animate={trustInView ? "visible" : "hidden"}>
            <h3 className="serif text-2xl font-bold text-gray-700 mb-2">Our Certificates</h3>
            <p className="sans text-gray-400 text-sm mb-8 font-light">Click any certificate to view</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {certs.map((c, i) => (
              <motion.div key={c.name} variants={fadeUp} custom={i} initial="hidden" animate={certInView ? "visible" : "hidden"}>
                <CertCard {...c} />
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeIn} initial="hidden" animate={certInView ? "visible" : "hidden"}
            className="mt-8 sans text-green-600 text-sm font-light italic">
            * Certificates will be displayed here once uploaded
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section ref={timelineRef} className="py-24 px-6" style={{ background: "linear-gradient(to bottom, #f0fdf4, #ffffff)" }}>
        <div className="max-w-xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate={timelineInView ? "visible" : "hidden"} className="text-center mb-14">
            <p className="sans text-green-600 tracking-[0.3em] text-xs uppercase font-semibold mb-3">Our Journey</p>
            <h2 className="serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">Milestones of<br /><span className="text-green-600 italic">Growth</span></h2>
            <Divider />
          </motion.div>
          <div>
            {timeline.map((t, i) => (
              <TimelineItem key={t.year} {...t} i={i} isLast={i === timeline.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Anbu Care Trust ── */}
      <section ref={careRef} className="py-24 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #14532d 0%, #065f46 50%, #064e3b 100%)" }}>
        <FloatingLeaves />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate={careInView ? "visible" : "hidden"}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.2)" }}><HeartHandshake size={32} className="text-green-300" /></div>
            <p className="sans text-green-300 tracking-[0.3em] text-xs uppercase font-semibold mb-3">Giving Back</p>
            <h2 className="serif text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Anbu Care <span className="text-green-300 italic">Trust</span>
            </h2>
            <Divider />
            <p className="sans text-green-100 text-base leading-relaxed font-light mt-6 mb-12 max-w-2xl mx-auto">
              At Anbu Natural, we believe business should also create kindness. Through our upcoming Anbu Care initiative, we aim to make a meaningful difference in communities.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-5">
            {careItems.map((c, i) => (
              <motion.div key={c.label} variants={fadeUp} custom={i} initial="hidden" animate={careInView ? "visible" : "hidden"}
                whileHover={{ scale: 1.08, y: -5 }}
                className="flex flex-col items-center gap-2 rounded-2xl px-6 py-5 cursor-default"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}>
                <span>{c.icon}</span>
                <span className="sans text-green-100 text-xs font-medium text-center leading-tight max-w-[100px]">{c.label}</span>
              </motion.div>
            ))}
          </div>
          <motion.p variants={fadeIn} initial="hidden" animate={careInView ? "visible" : "hidden"} custom={6}
            className="sans text-green-300 text-sm mt-12 italic font-light">
            "Because even small acts of care can create meaningful change."
          </motion.p>
        </div>
      </section>

      {/* ── Footer Banner ── */}
      <section className="py-20 px-6 bg-white text-center border-t border-green-50">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <Leaf style={{ width: 40, color: "#4ade80", margin: "0 auto 20px" }} />
          <h2 className="serif text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
            "Nature, Wellness &amp; Care —<br />
            <span className="text-green-600 italic">Together in Every Product."</span>
          </h2>
          <p className="sans text-gray-400 text-sm font-light mt-4">Every order from Anbu Natural is packed with gratitude, care, and responsibility.</p>
          <div className="flex justify-center items-center gap-3 mt-8">
            <span className="text-gray-300 text-xs sans tracking-widest uppercase">With gratitude</span>
            <span className="text-green-400">•</span>
            <span className="serif font-bold text-green-700 text-lg">Team Anbu Natural</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}