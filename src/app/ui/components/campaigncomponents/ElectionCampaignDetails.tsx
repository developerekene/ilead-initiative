import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { castVote } from "../../../redux/slices/campaignSlice";
import Button from "../Button";
import { toast } from "react-hot-toast";

const ElectionCampaignDetails: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user);
  const campaigns = useSelector((state: RootState) => state.campaignSlice.campaigns);
  const isUserLoggedIn = user.isLoggedIn;

  const campaign = campaigns.find((c) => c.id === campaignId);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [campaignId]);

  if (!campaign) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-slate-50 border border-purple-950/5 rounded-2xl flex items-center justify-center mb-4 text-purple-950/40 text-xl font-bold">
          🔍
        </div>
        <h2 className="text-xl font-black text-purple-950 tracking-tight">
          Workflow Not Found
        </h2>
        <Link
          to="/all-Campaign"
          className="bg-purple-950 hover:bg-orange-500 text-white font-bold py-3 px-5 rounded-xl text-sm transition-all mt-6"
        >
          Return to Active Workflows
        </Link>
      </main>
    );
  }

  const handleVote = (candidate: string) => {
    if (!isUserLoggedIn) {
      navigate("/sign-in", { state: { from: location } });
      toast.error(`Authentication required to vote. Let's sign you in.`, {
        style: { background: "#ff4d4f", color: "#fff" },
      });
      return;
    }

    setIsVoting(true);
    setTimeout(() => {
      dispatch(castVote({ campaignId: campaign.id, candidate }));
      setHasVoted(true);
      setIsVoting(false);
      toast.success(`Your vote for ${candidate} has been recorded!`, {
        style: { background: "#4BB543", color: "#fff" },
      });
    }, 1000);
  };

  const totalVotes = campaign.votes ? Object.values(campaign.votes).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="bg-white min-h-screen text-purple-950 relative overflow-x-hidden">
      <section className="w-full max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Campaign header */}
        <div className="border-b border-purple-950/5 pb-10 mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-bold text-purple-700 tracking-wider uppercase bg-purple-50 px-3.5 py-1.5 rounded-lg border border-purple-100">
              {campaign.category}
            </span>
            <span className="text-xs font-bold text-orange-500 flex items-center gap-1.5 bg-orange-50/50 border border-orange-100/50 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              {campaign.statusBadge}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-purple-950 leading-tight mb-6 break-words">
            {campaign.title}
          </h1>
          <p className="text-base sm:text-xl text-purple-950/70 font-medium leading-relaxed max-w-3xl break-words">
            {campaign.description}
          </p>
        </div>

        {/* Body + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full">
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-xs font-black text-purple-950/40 uppercase tracking-widest mb-4">
                Operational Intent & Scope
              </h3>
              <p className="text-sm sm:text-base text-purple-950/80 font-medium leading-relaxed break-words">
                {campaign.longFormBody}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-black text-purple-950/40 uppercase tracking-widest mb-4">
                Core Deliverable Benchmarks
              </h3>
              <ul className="space-y-3.5">
                {campaign.keyDeliverables.map((deliverable, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm sm:text-base text-purple-950/70 font-medium leading-relaxed"
                  >
                    <span className="text-orange-500 mt-1 font-bold select-none text-xs shrink-0 bg-orange-50 border border-orange-100 w-5 h-5 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                    <span className="break-words">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sticky sidebar for Voting */}
          <div className="lg:col-span-5 bg-slate-50 border border-purple-950/[0.03] rounded-[2rem] p-6 sm:p-8 space-y-6 lg:sticky lg:top-8 shadow-sm">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-950/40 block mb-1">
                Election Status
              </span>
              <div className="text-3xl font-black text-purple-950 tracking-tight">
                {hasVoted ? "Vote Recorded" : "Cast Your Vote"}
              </div>
            </div>
            <div className="border-t border-purple-950/5 pt-6 space-y-4">
              <div>
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-wide mb-1.5">
                  Candidates
                </h4>
                <p className="text-xs text-purple-950/50 font-medium leading-relaxed">
                  Select a candidate below to cast your vote. You can only vote once per election.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                {campaign.candidates && campaign.candidates.length > 0 ? (
                  campaign.candidates.map((candidate, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleVote(candidate)}
                        disabled={hasVoted || isVoting}
                        className={`w-full flex items-center gap-4 font-bold py-3 px-4 rounded-xl text-left text-sm transition-all duration-300 cursor-pointer ${
                          hasVoted
                            ? "bg-slate-200 text-purple-950/40 cursor-not-allowed border border-slate-300"
                            : "bg-white hover:bg-purple-50 border border-purple-950/10 text-purple-950 shadow-sm hover:shadow-md hover:border-orange-500/20"
                        }`}
                      >
                        {campaign.candidatePhotos?.[idx] ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500/10 shrink-0">
                            <img src={campaign.candidatePhotos[idx]} alt={candidate} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                            👤
                          </div>
                        )}
                        <span className="flex-1">
                          {isVoting ? "Processing..." : `Vote for ${candidate}`}
                        </span>
                      </button>
                      {hasVoted && (
                        <div className="w-full flex justify-between items-center text-xs font-medium text-purple-950/60 px-2">
                          <span>Total Votes:</span>
                          <span className="font-bold text-orange-500 text-sm">
                            {campaign.votes?.[candidate] || 0}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-red-500 font-medium">No candidates found for this election.</p>
                )}
              </div>
              
              {hasVoted && (
                <div className="mt-4 pt-4 border-t border-purple-950/10 text-center">
                  <p className="text-xs font-bold text-green-600 bg-green-50 py-2 rounded-lg border border-green-100">
                    Thank you for voting!
                  </p>
                  <p className="text-[10px] text-purple-950/40 mt-2">
                    Total Votes Cast in this Election: {totalVotes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div className="text-center mt-16 pt-8 border-t border-purple-950/5">
          <Button
            text="View All Other Campaigns"
            to="/all-Campaign"
            className="w-full bg-purple-950 hover:bg-orange-500 text-white font-black py-4 px-6 rounded-xl text-center text-sm tracking-wide shadow-lg shadow-purple-950/10 hover:shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          />
        </div>
      </section>
    </div>
  );
};

export default ElectionCampaignDetails;
