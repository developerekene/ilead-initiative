import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { ISHARE_COLLECTION, ISharePost } from "../../utils/Ishareschema";

/* ─── Style maps ──────────────────────────────────── */

const POST_CATEGORY_STYLES: Record<string, string> = {
  skills: "bg-blue-50 text-blue-600 border-blue-100",
  hardware: "bg-emerald-50 text-emerald-600 border-emerald-100",
  mentorship: "bg-purple-50 text-purple-700 border-purple-100",
  other: "bg-slate-50 text-slate-500 border-slate-200",
};

const POST_STATUS: Record<
  string,
  { label: string; box: string; dot: string }
> = {
  active: {
    label: "Available",
    box: "bg-green-50 border-green-200 text-green-700",
    dot: "bg-green-500",
  },
  pending_match: {
    label: "In Progress",
    box: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-500",
  },
  fulfilled: {
    label: "Fulfilled",
    box: "bg-purple-50 border-purple-200 text-purple-700",
    dot: "bg-purple-500",
  },
  archived: {
    label: "Ended",
    box: "bg-slate-50 border-slate-200 text-slate-500",
    dot: "bg-slate-400",
  },
};

/* ─── Static content ──────────────────────────────── */

const PILLARS = [
  {
    icon: "🔄",
    title: "Peer Skill Exchange",
    desc: "A zero-hierarchy exchange where every member — regardless of class or level — offers what they know and requests what they need.",
  },
  {
    icon: "🎓",
    title: "Cross-Cohort Pairing",
    desc: "Senior members mentor rising cohorts while juniors bring fresh perspectives, creating a living mentorship loop across every generation of the community.",
  },
  {
    icon: "🧩",
    title: "Collaborative Projects",
    desc: "Form mixed-level squads on real community initiatives, where hands-on collaboration replaces isolated, individual learning.",
  },
  {
    icon: "🏆",
    title: "Mutual Elevation",
    desc: "Recognition, referrals, and shared wins — every exchange compounds the collective capability of the whole ecosystem.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Join the Ecosystem",
    desc: "Create a profile and share the skills you can offer and the skills you want to learn across the community.",
  },
  {
    step: "02",
    title: "Get Cross-Matched",
    desc: "Our community pairs you with peers across different classes, cohorts, and skill levels that complement yours.",
  },
  {
    step: "03",
    title: "Exchange & Collaborate",
    desc: "Swap mentorship, join mixed-level squads, and collaborate on real projects together — teaching as you learn.",
  },
  {
    step: "04",
    title: "Elevate & Pass It On",
    desc: "As you level up, become the mentor for the next class and keep the loop of mutual elevation alive.",
  },
];

const FOCUS_AREAS = [
  "Peer Mentorship",
  "Skill Swaps",
  "Project Collaboration",
  "Feedback & Code Review",
  "Career Referrals",
  "Community Recognition",
];

/* ─── Page ────────────────────────────────────────── */

const CrossClassInteraction: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [exchangePosts, setExchangePosts] = useState<ISharePost[]>([]);

  // Fetch live mentorship posts from the iShare peer exchange
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const snap = await getDocs(
          query(
            collection(db, ISHARE_COLLECTION),
            where("category", "==", "mentorship"),
          ),
        );
        const posts = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as ISharePost,
        );
        setExchangePosts(posts);
      } catch (error) {
        console.error("Failed to load peer exchange posts", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <Hero
        badge="Cross-Class Interaction"
        firstTitle="Every level."
        secondTitle="Learn from"
        thirdTitle="Each Other"
        desc="Cross-Class Interaction is iLead's peer-exchange layer — where members at every stage of their journey share skills, swap mentorship, and collaborate across cohorts. The fastest growth happens when you teach and learn from the people beside you."
        buttonOneText="Explore Peer Exchange"
        buttonTwoText="Join the Ecosystem"
        btnOneNavigation="/iShare"
        btnTwoNavigation="/join-our-community"
      />

      {/* ─── PROGRAM OVERVIEW ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-8">
          <h2 className="text-xs font-black text-purple-950/40 uppercase tracking-widest pl-0.5">
            Program Overview
          </h2>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Exchange That Elevates Everyone
          </h3>
          <p className="text-sm text-purple-950/60 font-medium leading-relaxed">
            We break the silos between classes and cohorts. Whether you're just
            starting or already leading, there's always a peer who needs what
            you know — and something new to learn from you.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {FOCUS_AREAS.map((area) => (
              <span
                key={area}
                className="text-[10px] font-black uppercase tracking-wider text-purple-950/50 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-lg"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-slate-50 border border-purple-950/[0.02] p-6 sm:p-8 rounded-2xl space-y-3 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 bg-white border border-purple-950/5 rounded-xl flex items-center justify-center text-lg shadow-sm">
                {pillar.icon}
              </div>
              <h4 className="text-base font-black tracking-tight text-purple-950">
                {pillar.title}
              </h4>
              <p className="text-xs sm:text-sm text-purple-950/70 font-semibold leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="bg-purple-950 text-white rounded-[2.5rem] mx-4 my-8 md:mx-8 px-6 py-16 md:py-24 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-black text-orange-400 uppercase tracking-widest">
              The Journey
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              How Cross-Class Interaction Works
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-3 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-3xl font-black text-orange-400">
                  {item.step}
                </span>
                <h4 className="text-base font-black tracking-tight">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-white/70 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVE PEER EXCHANGE ─── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">
            Live Now
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950">
            Active Cross-Class{" "}
            <span className="text-orange-500">Exchanges</span>
          </h3>
          <p className="text-base text-purple-950/60 font-medium leading-relaxed mt-4">
            Live mentorship offers and requests posted by community members
            across every class. Jump in and make a connection.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="animate-spin w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : exchangePosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exchangePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4 bg-slate-50 border border-purple-950/5 rounded-[2rem]">
            <span className="text-5xl block">🔄</span>
            <h3 className="text-xl font-black text-purple-950">
              No active exchanges yet
            </h3>
            <p className="text-sm text-purple-950/60 font-medium max-w-md mx-auto">
              Post a mentorship offer or request in the iShare community to
              open the cross-class exchange.
            </p>
            <Link
              to="/iShare"
              className="inline-flex items-center gap-2 bg-purple-950 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg mt-4"
            >
              Go to iShare
            </Link>
          </div>
        )}
      </section>

      {/* ─── CTA BAND ─── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-purple-950 to-purple-900 rounded-[2.5rem] px-6 py-14 md:py-16 text-center text-white shadow-xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl transform -translate-x-12 translate-y-12 pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to connect across classes?
            </h3>
            <p className="text-sm sm:text-base text-white/70 font-medium leading-relaxed">
              Join the ecosystem, post your first exchange, and start teaching
              and learning from the people around you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                to="/join-our-community"
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                Join the Ecosystem
              </Link>
              <Link
                to="/membership"
                className="bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300"
              >
                View Membership Tiers
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ─── Peer exchange post card ──────────────────────── */

const formatTimestamp = (ts: any): string => {
  try {
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
};

const PostCard: React.FC<{ post: ISharePost }> = ({ post }) => {
  const status = POST_STATUS[post.status] ?? POST_STATUS.archived;
  const isGive = post.type === "offer_give";
  const catStyle =
    POST_CATEGORY_STYLES[post.category] ??
    "bg-slate-50 text-slate-500 border-slate-200";

  return (
    <div className="bg-white border border-purple-950/5 rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-2xl hover:border-orange-500/20">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border ${
              isGive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {isGive ? "Offer · Give" : "Request · Need"}
          </span>
          <span
            className={`text-[10px] font-bold flex items-center gap-1 px-2 py-1 rounded-lg border ${status.box}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-purple-950 leading-snug mb-3 group-hover:text-purple-700 transition-colors break-words">
          {post.title}
        </h3>

        <p className="text-xs sm:text-sm text-purple-950/60 font-medium leading-relaxed mb-6 break-words line-clamp-3">
          {post.description}
        </p>
      </div>

      <div>
        {/* Meta */}
        <div className="flex justify-between items-center pt-4 border-t border-purple-950/5 mb-4 text-xs">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border ${catStyle}`}
          >
            {post.category}
          </span>
          <span className="text-purple-950/50 font-medium">
            {formatTimestamp(post.timestamp)}
          </span>
        </div>

        {/* Action */}
        <Link
          to={`/ishare/post/${post.id}`}
          className="w-full bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold py-2.5 px-4 rounded-xl text-center text-xs transition-all duration-200"
        >
          View Exchange
        </Link>
      </div>
    </div>
  );
};

export default CrossClassInteraction;