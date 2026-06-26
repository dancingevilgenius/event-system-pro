import { ContestSelectionPage } from "@/pages/ContestSelectionPage";

export default function CompetitorPage() {
  return (
    <ContestSelectionPage
      title="Competitor"
      testIdPrefix="competitor"
      buttons={[
        { label: "Contest 1" },
        { label: "Contest 2" },
        { label: "Contest 3" },
      ]}
    />
  );
}
