import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="text-sm font-medium text-ink-muted">Signature Solution</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">Sign in</h1>
        <p className="mt-1 text-sm text-ink-muted">Daily Ops Hub</p>

        <div className="card mt-6 p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
