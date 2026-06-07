export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      minHeight: "calc(100vh / 0.9)",
      background: "var(--color-bg)",
    }}>
      {children}
    </div>
  );
}
