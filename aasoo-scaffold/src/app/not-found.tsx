import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-5xl font-extrabold">۴۰۴</h1>
      <p className="mt-4 text-neutral-600">صفحه مورد نظر پیدا نشد.</p>
      <Link href="/" className="mt-8 inline-block">
        <Button variant="primary">بازگشت به خانه</Button>
      </Link>
    </div>
  );
}
