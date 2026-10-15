import ContestSelectionPage from './ContestSelectionPage';

export default function CompetitorHomePage() {
  return (
    <ContestSelectionPage
      title="Competitor Home"
      links={[{ label: 'My WSDC #', route: '/competitor-wsdc' }]}
    />
  );
}
