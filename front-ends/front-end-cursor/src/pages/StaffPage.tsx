import ContestSelectionPage from './ContestSelectionPage';

export default function StaffPage() {
  return (
    <ContestSelectionPage
      title="Staff"
      links={[{ label: 'Workshop Headcount', route: '/workshop-head-count' }]}
    />
  );
}
