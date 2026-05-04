import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Account Settings</p>
            <h1 className="mt-2 text-3xl font-bold">Your profile</h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
          <p className="text-sm text-slate-600">
            This is a placeholder for account settings. You can add profile, security, and preference controls here.
          </p>
        </div>
      </div>
    </div>
  );
}
