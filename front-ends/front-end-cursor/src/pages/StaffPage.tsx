import ContestSelectionPage from './ContestSelectionPage';

export default function StaffPage() {
  return (
    <ContestSelectionPage
      title="Staff"
      links={[
        { label: 'Prelims', route: '/prelims' },
        { label: 'Contest 1', route: '/judging' },
        { label: 'Contest 2', route: '/judging' },
        { label: 'Contest 3', route: '/judging' },
      ]}
    />
  );
}
