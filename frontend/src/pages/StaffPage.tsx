import { ContestSelectionPage } from "@/pages/ContestSelectionPage";

export default function StaffPage() {
  return (
    <ContestSelectionPage
      title="Staff"
      testIdPrefix="staff"
      buttons={[
        { label: "Contest 1", route: "/judging" },
        { label: "Contest 2", route: "/judging" },
        { label: "Contest 3", route: "/judging" },
      ]}
    />
  );
}
