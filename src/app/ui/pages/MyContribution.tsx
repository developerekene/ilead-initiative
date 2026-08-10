import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { selectUser } from "../../redux/slices/User";
import type { Campaign } from "../../redux/slices/campaignSlice";
import { setCampaigns } from "../../redux/slices/campaignSlice";
import { campaignService } from "../../redux/configuration/services/campaign.service";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { ISHARE_COLLECTION, ISharePost } from "../../utils/Ishareschema";

/* ─── Style maps ──────────────────────────────────── */

const CAMPAIGN_CATEGORY_STYLES: Record<string, string> = {
  "Tech Mentorship": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Business Strategy": "bg-blue-50 text-blue-700 border-blue-200",
  "Community Giving": "bg-purple-50 text-purple-700 border-purple-200",
  Election: "bg-amber-50 text-amber-700 border-amber-200",
};

const POST_CATEGORY_STYLES: Record<string, string> = {
  skills: "bg-blue-50 text-blue-600 border-blue-100",
  hardware: "bg-emerald-50 text-emerald-600 border-emerald-100",
  mentorship: "bg-purple-50 text-purple-700 border-purple-100",
  other: "bg-slate-50 text-slate-500 border-slate-200",
};

const POST_STATUS: Record<string, { label: string; box: string; dot: string }> =
  {
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

/* ─── Helpers ─────────────────────────────────────── */

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

const campaignDetailsLink = (campaign: Campaign) =>
  campaign.category === "Election"
    ? `/all-Campaign/election-details/${campaign.id}`
    : `/all-Campaign/campaign-details/${campaign.id}`;

/* ─── Types ───────────────────────────────────────── */

type TabId = "backed" | "volunteered" | "votes" | "ishare";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "backed", label: "Backed Initiatives", icon: "🤝" },
  { id: "volunteered", label: "Volunteer Roles", icon: "🙋" },
  { id: "votes", label: "Election Votes", icon: "🗳️" },
  { id: "ishare", label: "iShare Exchanges", icon: "🔄" },
];

/* ─── Component ───────────────────────────────────── */

const MyContribution: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const allCampaigns = useSelector(
    (state: RootState) => state.campaignSlice.campaigns,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [myPosts, setMyPosts] = useState<ISharePost[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>("backed");

  const userId = user?.uid;
  const isLoggedIn = Boolean(user?.isLoggedIn && userId);

  // Fetch all campaigns + this user's iShare posts on mount
  useEffect(() => {
    const loadContributions = async () => {
      setIsLoading(true);
      try {
        const [fetchedCampaigns, postsSnap] = await Promise.all([
          campaignService.fetchAllCampaigns(),
          isLoggedIn
            ? getDocs(
                query(
                  collection(db, ISHARE_COLLECTION),
                  where("userId", "==", userId),
                ),
              )
            : Promise.resolve(null),
        ]);

        dispatch(setCampaigns(fetchedCampaigns));

        if (postsSnap) {
          const posts = postsSnap.docs.map(
            (d) => ({ id: d.id, ...d.data() }) as ISharePost,
          );
          setMyPosts(posts);
        }
      } catch (error) {
        console.error("Failed to load contributions", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContributions();
  }, [dispatch, isLoggedIn, userId]);

  // Derived contribution buckets
  const backed = useMemo(
    () => allCampaigns.filter((c) => c.backedBy?.includes(userId)),
    [allCampaigns, userId],
  );

  const volunteered = useMemo(
    () => allCampaigns.filter((c) => c.volunteeredBy?.includes(userId)),
    [allCampaigns, userId],
  );

  const votes = useMemo(
    () => allCampaigns.filter((c) => c.votedBy?.includes(userId)),
    [allCampaigns, userId],
  );

  // Unique campaign count across all participation types
  const uniqueCampaignCount = useMemo(() => {
    const ids = new Set([
      ...backed.map((c) => c.id),
      ...volunteered.map((c) => c.id),
      ...votes.map((c) => c.id),
    ]);
    return ids.size;
  }, [backed, volunteered, votes]);

  const totalContributions = uniqueCampaignCount + myPosts.length;

  const stats = [
    {
      label: "Initiatives Backed",
      value: backed.length,
      icon: "🤝",
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-700",
    },
    {
      label: "Volunteer Roles",
      value: volunteered.length,
      icon: "🙋",
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-600",
    },
    {
      label: "Election Votes Cast",
      value: votes.length,
      icon: "🗳️",
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-700",
    },
    {
      label: "iShare Exchanges",
      value: myPosts.length,
      icon: "🔄",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
    },
  ];

  /* ── Sign-in guard ─────────────────────────────── */
  if (!isLoggedIn) {
    return (
      <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
        <section className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
            My Contributions
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-purple-950 mt-6">
            Sign in to view your impact
          </h1>
          <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed max-w-2xl mx-auto mt-4">
            Your backed initiatives, volunteer roles, election votes and iShare
            exchanges are all gathered here. Sign in to see your contribution
            footprint across the ecosystem.
          </p>
          <Link
            to="/sign-in"
            className="inline-flex items-center gap-2 bg-purple-950 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg mt-8"
          >
            Sign In
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full bg-white text-purple-950 min-h-screen font-sans overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-12 border-b border-purple-950/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-3.5 py-1.5 rounded-lg border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              My Contributions
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight pt-2">
              Your <span className="text-orange-500">Impact</span> Footprint
            </h1>
            <p className="text-base sm:text-lg text-purple-950/70 font-medium leading-relaxed max-w-3xl">
              Every initiative you backed, role you volunteered for, vote you
              cast and exchange you made in the iShare ecosystem — tracked in
              one place.
            </p>
          </div>
          <div className="lg:col-span-4 lg:pt-14 flex justify-center lg:justify-end">
            <div className="bg-slate-50/60 border border-purple-950/[0.03] rounded-2xl p-5 sm:p-6 text-center space-y-2">
              <span className="text-3xl font-black text-purple-950">
                {totalContributions}
              </span>
              <span className="text-[10px] font-black text-purple-950/40 uppercase tracking-widest block">
                Total Contribution
                {totalContributions !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS OVERVIEW ─── */}
      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} border ${stat.border} rounded-2xl p-5 flex items-center gap-4`}
            >
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className={`text-2xl font-black ${stat.text}`}>
                  {isLoading ? "—" : stat.value}
                </p>
                <p className="text-xs font-bold text-purple-950/50 mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TABS ─── */}
      <section className="max-w-6xl mx-auto px-6 py-10 md:py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab) => {
            const count =
              tab.id === "backed"
                ? backed.length
                : tab.id === "volunteered"
                  ? volunteered.length
                  : tab.id === "votes"
                    ? votes.length
                    : myPosts.length;

            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-purple-950 text-white shadow-md"
                    : "bg-slate-50 text-purple-950/60 border border-purple-950/5 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "bg-white text-purple-950/40"
                  }`}
                >
                  {isLoading ? "—" : count}
                </span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="animate-spin w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : (
          <>
            {/* ── Backed Initiatives ── */}
            {activeTab === "backed" && (
              <ContributionSection
                icon="🤝"
                title="Initiatives You've Backed"
                description="Campaigns you supported as a backer to help them move forward."
                items={backed}
                emptyIcon="🤝"
                emptyTitle="No backed initiatives yet"
                emptyBody="Browse the campaign hub and back initiatives you believe in — they'll show up here."
                ctaTo="/all-Campaign"
                ctaLabel="Browse Campaigns"
                renderItem={(campaign) => (
                  <CampaignCard campaign={campaign} badge="Backed" />
                )}
              />
            )}

            {/* ── Volunteer Roles ── */}
            {activeTab === "volunteered" && (
              <ContributionSection
                icon="🙋"
                title="Volunteer Roles"
                description="Campaigns you registered for as an active volunteer."
                items={volunteered}
                emptyIcon="🙋"
                emptyTitle="No volunteer roles yet"
                emptyBody="Join a campaign as a volunteer to contribute your time and skills."
                ctaTo="/all-Campaign"
                ctaLabel="Find Campaigns"
                renderItem={(campaign) => (
                  <CampaignCard campaign={campaign} badge="Volunteer" />
                )}
              />
            )}

            {/* ── Election Votes ── */}
            {activeTab === "votes" && (
              <ContributionSection
                icon="🗳️"
                title="Election Votes Cast"
                description="Elections you participated in by casting your vote."
                items={votes}
                emptyIcon="🗳️"
                emptyTitle="No votes cast yet"
                emptyBody="Take part in community elections and have your voice counted."
                ctaTo="/all-Campaign"
                ctaLabel="Explore Elections"
                renderItem={(campaign) => (
                  <CampaignCard campaign={campaign} badge="Vote Cast" />
                )}
              />
            )}

            {/* ── iShare Exchanges ── */}
            {activeTab === "ishare" && (
              <ContributionSection
                icon="🔄"
                title="Your iShare Exchanges"
                description="Offers and needs you've posted to help the community."
                items={myPosts}
                emptyIcon="🔄"
                emptyTitle="No iShare posts yet"
                emptyBody="Post an offer or a need in the iShare community to start giving back."
                ctaTo="/iShare"
                ctaLabel="Go to iShare"
                renderItem={(post) => <PostCard post={post} />}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
};

/* ─── Reusable section wrapper ─────────────────────── */

interface ContributionSectionProps<T> {
  icon: string;
  title: string;
  description: string;
  items: T[];
  emptyIcon: string;
  emptyTitle: string;
  emptyBody: string;
  ctaTo: string;
  ctaLabel: string;
  renderItem: (item: T) => React.ReactNode;
}

const ContributionSection = <T,>({
  icon,
  title,
  description,
  items,
  emptyIcon,
  emptyTitle,
  emptyBody,
  ctaTo,
  ctaLabel,
  renderItem,
}: ContributionSectionProps<T>) => (
  <section>
    <div className="flex items-start gap-3 mb-6">
      <span className="text-2xl select-none">{icon}</span>
      <div>
        <h2 className="text-xl font-black text-purple-950 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-purple-950/50 font-medium mt-0.5">
          {description}
        </p>
      </div>
    </div>

    {items.length === 0 ? (
      <div className="text-center py-16 space-y-4">
        <span className="text-5xl block">{emptyIcon}</span>
        <h3 className="text-xl font-black text-purple-950">{emptyTitle}</h3>
        <p className="text-sm text-purple-950/60 font-medium max-w-md mx-auto">
          {emptyBody}
        </p>
        <Link
          to={ctaTo}
          className="inline-flex items-center gap-2 bg-purple-950 hover:bg-purple-900 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg mt-4"
        >
          {ctaLabel}
        </Link>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => renderItem(item))}
      </div>
    )}
  </section>
);

/* ─── Campaign contribution card ───────────────────── */

const CampaignCard: React.FC<{ campaign: Campaign; badge: string }> = ({
  campaign,
  badge,
}) => {
  const catStyle =
    CAMPAIGN_CATEGORY_STYLES[campaign.category] ??
    "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div className="bg-white border border-purple-950/5 rounded-[2rem] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-2xl hover:border-orange-500/20">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border ${catStyle}`}
          >
            {campaign.category}
          </span>
          <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            {badge}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-purple-950 leading-snug mb-3 group-hover:text-purple-700 transition-colors break-words">
          {campaign.title}
        </h3>

        <p className="text-xs sm:text-sm text-purple-950/60 font-medium leading-relaxed mb-6 break-words line-clamp-3">
          {campaign.description}
        </p>
      </div>

      <div>
        {/* Metric */}
        <div className="flex justify-between items-center pt-4 border-t border-purple-950/5 mb-4 text-xs">
          <span className="text-purple-950/50 font-medium truncate">
            {campaign.metricLabel ?? "Status"}
          </span>
          <span className="text-purple-950 font-black bg-purple-50/50 px-2 py-1 rounded-md">
            {campaign.metricValue ?? campaign.statusBadge}
          </span>
        </div>

        {/* Action */}
        <Link
          to={campaignDetailsLink(campaign)}
          className="w-full bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold py-2.5 px-4 rounded-xl text-center text-xs transition-all duration-200"
        >
          View Campaign
        </Link>
      </div>
    </div>
  );
};

/* ─── iShare post card ─────────────────────────────── */

const PostCard: React.FC<{ post: ISharePost }> = ({ post }) => {
  const catStyle =
    POST_CATEGORY_STYLES[post.category] ??
    "bg-slate-50 text-slate-500 border-slate-200";
  const status = POST_STATUS[post.status] ?? POST_STATUS.archived;
  const isGive = post.type === "offer_give";

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
          View Post
        </Link>
      </div>
    </div>
  );
};

export default MyContribution;
