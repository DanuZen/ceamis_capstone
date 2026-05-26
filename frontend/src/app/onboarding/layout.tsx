export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-bg)",
    }}>
      {children}
    </div>
  );
}
