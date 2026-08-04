import { WorkshopTypes } from "../../../utils/types";

const seatsFraction = (w: WorkshopTypes) => Math.min(w.enrolled / w.seats, 1);

const SeatsBar: React.FC<{ workshop: WorkshopTypes }> = ({ workshop }) => {
  const pct = seatsFraction(workshop) * 100;
  return (
    <div>
      <div className="flex justify-between text-[11px] font-semibold text-purple-950/40 mb-1.5">
        <span>{workshop.enrolled} enrolled</span>
        <span>{workshop.seats - workshop.enrolled} seats left</span>
      </div>
      <div className="h-1.5 bg-purple-950/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            pct >= 90 ? "bg-orange-500" : "bg-purple-700"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default SeatsBar;
