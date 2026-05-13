import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Leaf as LeafIcon, Heart, Baby, Sprout, Shield, Award, Smile, Handshake,
  TrendingUp, TreePine, UtensilsCrossed, Wheat, FlaskConical, Pill,
  Flag, Factory, Star, ClipboardList, Home, HeartHandshake, Salad,
  CheckCircle2, X
} from "lucide-react";

const useScrollInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return [ref, isInView];
};

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  })
};

import FounderSection from "../components/FounderSection";

const slideLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const slideRight = {
  hidden: { opacity: 0, x: 50 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const Leaf = ({ className = "", style = {} }) => (
  <svg viewBox="0 0 60 80" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 75 C30 75 5 55 5 30 C5 10 20 2 30 2 C40 2 55 10 55 30 C55 55 30 75 30 75Z" fill="currentColor" opacity="0.22"/>
    <path d="M30 75 L30 10" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
    <path d="M30 30 C20 25 12 28 8 32" stroke="currentColor" strokeWidth="1" opacity="0.35"/>
    <path d="M30 45 C40 40 48 43 52 47" stroke="currentColor" strokeWidth="1" opacity="0.35"/>
  </svg>
);

const Divider = ({ dark = false }) => (
  <div className="flex items-center justify-center gap-4 my-4">
    <div className="h-px w-16" style={{ background: dark ? "linear-gradient(to right, transparent, #6ee7b7)" : "linear-gradient(to right, transparent, #059669)" }} />
    <Leaf style={{ width: 20, color: dark ? "#6ee7b7" : "#059669" }} />
    <div className="h-px w-16" style={{ background: dark ? "linear-gradient(to left, transparent, #6ee7b7)" : "linear-gradient(to left, transparent, #059669)" }} />
  </div>
);

const TimelineItem = ({ year, text, icon, i, isLast }) => {
  const [ref, inView] = useScrollInView();
  return (
    <motion.div ref={ref} variants={fadeUp} custom={i} initial="hidden" animate={inView ? "visible" : "hidden"}
      className="flex gap-5 items-start relative">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
          transition={{ delay: i * 0.15 + 0.2, type: "spring", stiffness: 180 }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md z-10"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white" }}
        >{icon}</motion.div>
        {!isLast && <div className="w-0.5 flex-1 mt-1" style={{ minHeight: 48, background: "linear-gradient(to bottom, #a7f3d0, transparent)" }} />}
      </div>
      <div className="pb-10">
        <motion.div initial={{ opacity: 0, x: 24 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.15 + 0.3 }}>
          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold tracking-widest mb-2"
            style={{ background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0" }}>{year}</span>
          <p className="font-medium text-base leading-relaxed text-gray-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>{text}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function AnbuNaturalAbout() {
  const [differRef, differInView] = useScrollInView();
  const [visionRef, visionInView] = useScrollInView();
  const [missionRef, missionInView] = useScrollInView();
  const [timelineRef, timelineInView] = useScrollInView();
  const [certRef, certInView] = useScrollInView();
  const [trustRef, trustInView] = useScrollInView();
  const [careRef, careInView] = useScrollInView();
  const [commitRef, commitInView] = useScrollInView();

  const differentiators = [
    { icon: <LeafIcon size={28} />, title: "Natural Ingredients", desc: "Carefully chosen herbs, traditional ingredients, and naturally inspired formulations trusted for generations.", accent: "#059669" },
    { icon: <Heart size={28} />, title: "Made with Care", desc: "We see customers as families who trust us. That trust drives quality, honesty, and care in every step.", accent: "#e11d48" },
    { icon: <Baby size={28} />, title: "Family Wellness", desc: "Designed with family wellness in mind — women, children, and everyday household health from baby care to herbal wellness.", accent: "#d97706" },
    { icon: <Sprout size={28} />, title: "Tradition Meets Today", desc: "We value traditional herbal knowledge while adapting for today's lifestyle — making natural wellness practical.", accent: "#0284c7" },
  ];

  const missions = [
    "Encourage healthier lifestyles through natural products",
    "Support families with affordable wellness solutions",
    "Promote traditional herbal knowledge",
    "Create products with honesty, care, and responsibility",
    "Grow as a socially responsible brand",
  ];

  const commitments = [
    { icon: <Award size={26} />, text: "Quality-Focused", color: "#d97706" },
    { icon: <Smile size={26} />, text: "Customer First", color: "#059669" },
    { icon: <Handshake size={26} />, text: "Honest Practices", color: "#0284c7" },
    { icon: <TrendingUp size={26} />, text: "Continuous Growth", color: "#7c3aed" },
    { icon: <TreePine size={26} />, text: "Natural Wellness", color: "#16a34a" },
  ];

  const careItems = [
    { icon: <Salad size={26} />, label: "Child Nutrition Awareness" },
    { icon: <HeartHandshake size={26} />, label: "Women Wellness" },
    { icon: <Wheat size={26} />, label: "Rural Community Support" },
    { icon: <LeafIcon size={26} />, label: "Natural Health Awareness" },
    { icon: <Home size={26} />, label: "Support for Needy Families" },
  ];

  const certs = [
    { icon: <UtensilsCrossed size={30} />, name: "FSSAI", desc: "Food Safety & Standards Authority of India" },
    { icon: <Factory size={30} />, name: "MSME", desc: "Ministry of Micro, Small & Medium Enterprises", file: "/assets/about/msme.pdf" },
    { icon: <Star size={30} />, name: "AGMARK", desc: "Agricultural Mark — Quality Guarantee" },
    { icon: <ClipboardList size={30} />, name: "ISO", desc: "Quality Management System Certified" },
  ];

  const timeline = [
    { year: "2024", text: "Started Anbu Natural with a dream to bring nature-based wellness to every home.", icon: <Sprout size={18} /> },
    { year: "2025", text: "Expanded our product range — herbal hair oils, millet health mixes, baby care, and more.", icon: <LeafIcon size={18} /> },
    { year: "2026", text: "Launching Anbu Care Trust — giving back with love through community wellness initiatives.", icon: <HeartHandshake size={18} /> },
  ];

  const products = [
    { icon: <LeafIcon size={20} />, label: "Herbal Hair Oils", color: "#059669" },
    { icon: <Wheat size={20} />, label: "Millet Health Mixes", color: "#d97706" },
    { icon: <FlaskConical size={20} />, label: "Spice Powders & Premix", color: "#ea580c" },
    { icon: <Baby size={20} />, label: "Baby Care Powders", color: "#db2777" },
    { icon: <Pill size={20} />, label: "Wellness Products", color: "#0284c7" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fdfcf8", color: "#1f2937" }} className="min-h-screen overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #fdfcf8; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 99px; }
      `}</style>

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden py-24 md:py-32"
        style={{ background: "linear-gradient(160deg, #0a2618 0%, #0d3320 40%, #061410 100%)" }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px"
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(52,211,153,0.12) 0%, transparent 70%)" }} />
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="absolute pointer-events-none" style={{ color: "#34d399", left: `${8 + i * 16}%`, top: `${10 + (i % 3) * 28}%`, width: 28 + (i % 2) * 20, opacity: 0.07 + (i % 3) * 0.04 }}
            animate={{ y: [0, -14, 0], rotate: [0, 12, -8, 0] }} transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.6 }}>
            <Leaf />
          </motion.div>
        ))}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(52,211,153,0.1)", border: "1.5px solid rgba(110,231,183,0.35)" }}>
            <img src="/assets/common/logoheader.webp" alt="Anbu Natural Logo" className="w-16 h-auto drop-shadow-lg" />
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ color: "#6ee7b7", letterSpacing: "0.35em", fontSize: "0.7rem" }} className="uppercase font-semibold mb-4">About Us</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="serif text-white text-5xl md:text-7xl font-bold leading-tight mb-6"
            style={{ textShadow: "0 2px 60px rgba(52,211,153,0.2)" }}>
            Anbu Natural
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ color: "#a7f3d0", fontWeight: 300, fontSize: "1.1rem" }} className="leading-relaxed mb-12 max-w-2xl mx-auto">
            True wellness begins with nature. We're dedicated to creating natural, herbal, and wellness-based products that support healthier families and happier lifestyles.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            className="flex flex-wrap justify-center gap-4">
            {[
              { icon: <Flag size={22} />, label: "Made in India" },
              { icon: <UtensilsCrossed size={22} />, label: "FSSAI Certified" },
              { icon: <Factory size={22} />, label: "MSME Registered" },
            ].map((b) => (
              <motion.div key={b.label} whileHover={{ scale: 1.06, y: -3 }}
                className="flex items-center gap-2.5 px-5 py-3 rounded-xl"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(110,231,183,0.25)", backdropFilter: "blur(8px)" }}>
                <span style={{ color: "#6ee7b7" }}>{b.icon}</span>
                <span style={{ color: "#d1fae5", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em" }}>{b.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="relative py-24 px-6 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)" }} />
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <p style={{ color: "#059669", letterSpacing: "0.3em", fontSize: "0.7rem" }} className="uppercase font-semibold mb-3">Our Story</p>
            <h2 className="serif text-4xl md:text-5xl font-bold mb-5 leading-tight text-gray-900">
              Born from a<br /><span style={{ color: "#059669" }} className="italic">Simple Dream</span>
            </h2>
            <Divider />
            <p className="mt-6 text-base text-gray-600 leading-relaxed font-light">
              Anbu Natural was born from a simple dream — to create products that are closer to nature and safer for families. We started this journey with a desire to support healthier living using traditional ingredients, herbal knowledge, and natural wellness practices trusted for generations.
            </p>
            <p className="mt-4 text-base text-gray-600 leading-relaxed font-light">
              As a family-focused brand, we understand the importance of purity, care, and trust. Every product reflects our belief that wellness should be accessible to everyone.
            </p>
          </motion.div>
          <motion.div variants={slideRight} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            <div className="rounded-3xl p-8 bg-gray-50 shadow-sm border border-gray-200">
              <p style={{ color: "#059669", fontSize: "0.7rem", letterSpacing: "0.25em" }} className="uppercase font-semibold mb-6">What We Offer</p>
              {products.map((item, i) => (
                <motion.div key={item.label} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="flex items-center gap-4 mb-5 last:mb-0 bg-white p-3 rounded-2xl shadow-sm border border-gray-200">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}15`, color: item.color }}>
                    {item.icon}
                  </div>
                  <span className="text-gray-800 font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Daily Wellness Clock Section ── */}
      <section className="py-24 px-6 bg-[#f0f9f4]">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <p style={{ color: "#059669", letterSpacing: "0.3em", fontSize: "0.7rem" }} className="uppercase font-semibold mb-3">Daily Routine</p>
            <h2 className="serif text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Daily Wellness <span style={{ color: "#059669" }} className="italic">Clock</span>
            </h2>
            <Divider />
            <p className="mt-6 text-base text-gray-600 leading-relaxed font-light max-w-2xl mx-auto">
              Goodness in every moment, wellness in every day. Our wellness clock is a guide to natural living, helping you stay balanced and healthy throughout the day with Anbu Natural's trusted formulations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white"
          >
            <img 
              src="/assets/wellness/daily_wellness_clock.webp" 
              alt="Anbu Natural Daily Wellness Clock guide - Traditional herbal wellness routine from morning to night" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* ── What Makes Us Different ── */}
      <section ref={differRef} className="py-24 px-6 bg-[#fcfbf8]">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate={differInView ? "visible" : "hidden"} className="text-center mb-16">
            <p style={{ color: "#059669", letterSpacing: "0.3em", fontSize: "0.7rem" }} className="uppercase font-semibold mb-3">Why Choose Us</p>
            <h2 className="serif text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              What Makes Us<br /><span style={{ color: "#059669" }} className="italic">Different</span>
            </h2>
            <Divider />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((d, i) => (
              <motion.div key={d.title} variants={fadeUp} custom={i} initial="hidden" animate={differInView ? "visible" : "hidden"}
                whileHover={{ y: -8 }}
                className="rounded-3xl p-8 cursor-default transition-all duration-300 bg-white shadow-sm border border-gray-200 hover:shadow-md">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${d.accent}15`, color: d.accent }}>
                  {d.icon}
                </div>
                <h3 className="serif font-bold text-xl mb-3 leading-tight text-gray-900">{d.title}</h3>
                <p className="text-gray-600 font-light text-sm leading-relaxed">{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section ref={visionRef} className="py-24 px-6 relative overflow-hidden bg-[#f4f7f5]">
        <div className="max-w-5xl mx-auto relative z-10 grid md:grid-cols-2 gap-14">
          <motion.div variants={slideLeft} initial="hidden" animate={visionInView ? "visible" : "hidden"}>
            <p style={{ color: "#059669", letterSpacing: "0.3em", fontSize: "0.7rem" }} className="uppercase font-semibold mb-3">Our Vision</p>
            <h2 className="serif text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
              Growing Together,<br /><span style={{ color: "#059669" }} className="italic">Naturally</span>
            </h2>
            <div className="rounded-2xl p-6 bg-white border border-gray-200 shadow-sm">
              <p className="text-gray-600 font-light leading-relaxed">
                To become a trusted natural wellness brand that brings healthier living, traditional goodness, and affordable herbal care to every home across India and beyond.
              </p>
            </div>
          </motion.div>
          <motion.div ref={missionRef} variants={slideRight} initial="hidden" animate={visionInView ? "visible" : "hidden"}>
            <p style={{ color: "#059669", letterSpacing: "0.3em", fontSize: "0.7rem" }} className="uppercase font-semibold mb-3">Our Mission</p>
            <h2 className="serif text-4xl font-bold mb-6 leading-tight text-gray-900">
              What We <span style={{ color: "#059669" }} className="italic">Stand For</span>
            </h2>
            <ul className="space-y-3">
              {missions.map((m, i) => (
                <motion.li key={m} variants={fadeUp} custom={i} initial="hidden" animate={missionInView ? "visible" : "hidden"}
                  className="flex items-start gap-4 rounded-xl px-5 py-4 bg-white border border-gray-200 shadow-sm">
                  <span className="mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
                    <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 2.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
                  </span>
                  <span className="text-gray-700 font-light text-sm leading-relaxed">{m}</span>
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
            <p style={{ color: "#059669", letterSpacing: "0.3em", fontSize: "0.7rem" }} className="uppercase font-semibold mb-3">Our Commitment</p>
            <h2 className="serif text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Committed to<br /><span style={{ color: "#059669" }} className="italic">Excellence</span>
            </h2>
            <Divider />
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {commitments.map((c, i) => (
              <motion.div key={c.text} variants={fadeUp} custom={i} initial="hidden" animate={commitInView ? "visible" : "hidden"}
                whileHover={{ scale: 1.06, y: -4 }}
                className="flex flex-col items-center gap-3 rounded-2xl px-7 py-6 cursor-default transition-all duration-300 bg-gray-50 border border-gray-200"
                style={{ minWidth: 130 }}>
                <span style={{ color: c.color }}>{c.icon}</span>
                <span className="text-gray-800 font-semibold text-sm text-center">{c.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust & Certifications ── */}
      <section ref={trustRef} className="py-24 px-6 relative" style={{ background: "#0a2618" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#34d399 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" animate={trustInView ? "visible" : "hidden"}>
            <p style={{ color: "#6ee7b7", letterSpacing: "0.3em", fontSize: "0.7rem" }} className="uppercase font-semibold mb-3">Our Trust</p>
            <h2 className="serif text-4xl md:text-5xl font-bold mb-4 text-white">
              Certified &amp;<br /><span style={{ color: "#34d399" }} className="italic">Trustworthy</span>
            </h2>
            <Divider dark={true} />
            <p style={{ color: "#a7f3d0", fontWeight: 300 }} className="text-base mt-6 mb-14 max-w-xl mx-auto">
              Every product we make is backed by certification, quality checks, and a deep sense of responsibility towards our customers.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {[
              { icon: <Flag size={36} style={{ color: "#fbbf24" }} />, title: "Made in India", sub: "Proudly Indian" },
              { icon: <UtensilsCrossed size={36} style={{ color: "#34d399" }} />, title: "FSSAI", sub: "Food Safe & Approved" },
              { icon: <Factory size={36} style={{ color: "#60a5fa" }} />, title: "MSME", sub: "Govt. Registered" },
            ].map((t, i) => (
              <motion.div key={t.title} variants={fadeUp} custom={i} initial="hidden" animate={trustInView ? "visible" : "hidden"}
                whileHover={{ y: -6 }}
                className="flex flex-col items-center gap-3 rounded-3xl px-10 py-8 transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
                {t.icon}
                <span className="serif font-bold text-xl text-white">{t.title}</span>
                <span style={{ color: "#6ee7b7", fontSize: "0.7rem", letterSpacing: "0.2em" }} className="uppercase">{t.sub}</span>
              </motion.div>
            ))}
          </div>
          
          <motion.div ref={certRef} variants={fadeUp} initial="hidden" animate={trustInView ? "visible" : "hidden"}>
            <h3 className="serif text-2xl font-bold mb-2 text-white">Our Certificates</h3>
            <p style={{ color: "#6ee7b7", fontSize: "0.85rem", opacity: 0.8 }} className="mb-8 font-light">Click any certificate to view</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certs.map((c, i) => (
              <motion.div key={c.name} variants={fadeUp} custom={i} initial="hidden" animate={certInView ? "visible" : "hidden"}
                whileHover={{ scale: 1.04, y: -4 }}
                onClick={() => c.file && window.open(c.file, '_blank')}
                className={`flex flex-col items-center gap-3 rounded-2xl p-6 transition-all duration-300 ${c.file ? 'cursor-pointer hover:bg-white/10' : 'cursor-default opacity-80'}`}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(52,211,153,0.15)", color: "#6ee7b7" }}>
                  {c.icon}
                </div>
                <div className="text-center">
                  <div className="serif font-bold text-base text-white">{c.name}</div>
                  <div style={{ color: "#a7f3d0", fontSize: "0.75rem", fontWeight: 300 }} className="mt-1">{c.desc}</div>
                </div>
                {c.file && <span className="text-[10px] text-emerald-400 font-bold uppercase mt-1 tracking-widest">View Document</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section ref={timelineRef} className="py-24 px-6 bg-[#fcfbf8]">
        <div className="max-w-xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate={timelineInView ? "visible" : "hidden"} className="text-center mb-14">
            <p style={{ color: "#059669", letterSpacing: "0.3em", fontSize: "0.7rem" }} className="uppercase font-semibold mb-3">Our Journey</p>
            <h2 className="serif text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Milestones of<br /><span style={{ color: "#059669" }} className="italic">Growth</span>
            </h2>
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
      <section ref={careRef} className="py-24 px-6 relative overflow-hidden bg-[#eef5f1]">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate={careInView ? "visible" : "hidden"}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-200">
              <HeartHandshake size={30} className="text-emerald-600" />
            </div>
            <p className="text-emerald-700 uppercase font-semibold mb-3 tracking-[0.3em] text-[0.7rem]">Giving Back</p>
            <h2 className="serif text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-900">
              Anbu Care <span className="text-emerald-600 italic">Trust</span>
            </h2>
            <Divider />
            <p className="text-gray-600 font-light text-base mt-6 mb-12 max-w-2xl mx-auto leading-relaxed">
              At Anbu Natural, we believe business should also create kindness. Through our upcoming Anbu Care initiative, we aim to make a meaningful difference in communities.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {careItems.map((c, i) => (
              <motion.div key={c.label} variants={fadeUp} custom={i} initial="hidden" animate={careInView ? "visible" : "hidden"}
                whileHover={{ scale: 1.07, y: -5 }}
                className="flex flex-col items-center gap-2 rounded-2xl px-6 py-5 cursor-default transition-all duration-300 bg-white border border-gray-200 shadow-sm">
                <span className="text-emerald-500">{c.icon}</span>
                <span className="text-gray-800 text-[0.8rem] font-medium max-w-[100px] text-center leading-snug">{c.label}</span>
              </motion.div>
            ))}
          </div>
          <motion.p variants={fadeUp} custom={6} initial="hidden" animate={careInView ? "visible" : "hidden"}
            className="text-sm mt-12 italic font-light text-emerald-700">
            "Because even small acts of care can create meaningful change."
          </motion.p>
        </div>
      </section>

      {/* ── Founder Section ── */}
      <FounderSection />

      {/* ── Footer Banner ── */}
      <section className="py-20 px-6 text-center" style={{ background: "#0a2618" }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <img src="/assets/common/logoheader.webp" alt="Anbu Natural Logo" className="w-16 h-auto mx-auto mb-6 drop-shadow-md" />
          <h2 className="serif text-3xl md:text-4xl font-bold mb-4 leading-tight text-white">
            "Nature, Wellness &amp; Care —<br />
            <span style={{ color: "#34d399" }} className="italic">Together in Every Product."</span>
          </h2>
          <p style={{ color: "#a7f3d0", fontSize: "0.9rem", fontWeight: 300, opacity: 0.8 }} className="mt-4">
            Every order from Anbu Natural is packed with gratitude, care, and responsibility.
          </p>
          <div className="flex justify-center items-center gap-3 mt-8">
            <span style={{ color: "#6ee7b7", fontSize: "0.7rem", letterSpacing: "0.2em", opacity: 0.8 }} className="uppercase">With gratitude</span>
            <span style={{ color: "#34d399" }}>•</span>
            <span className="serif font-bold text-lg" style={{ color: "#34d399" }}>Team Anbu Natural</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}