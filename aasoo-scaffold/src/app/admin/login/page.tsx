import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-bold">ورود به پنل مدیریت</h1>
      <p className="mt-2 text-sm text-neutral-500">رمز عبور را وارد کنید.</p>
      <AdminLoginForm />
    </div>
  );
}
