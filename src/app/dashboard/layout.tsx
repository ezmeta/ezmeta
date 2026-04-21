import FeedbackWidget from '@/components/shared/FeedbackWidget';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <FeedbackWidget />
    </div>
  );
}