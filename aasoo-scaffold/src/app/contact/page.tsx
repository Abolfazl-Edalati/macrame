import { INSTAGRAM_URL, TELEGRAM_URL } from "@/lib/links";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "تماس و سفارش سفارشی | آسو مکرومه",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">تماس و سفارش سفارشی</h1>
      <p className="mt-3 leading-8 text-neutral-600">
        اگر قطعه‌ای را می‌پسندید که موجود نیست، یا می‌خواهید قطعه‌ای کاملاً اختصاصی برای خود یا
        عزیزانتان داشته باشید، از طریق پیام‌رسان‌ها در ارتباط باشید.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>اینستاگرام</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-neutral-600">
            تازه‌ترین آثار و ویدیوهای بافت را اینجا ببینید.
            <div className="mt-4">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Button className="w-full">@aasoo_macrame</Button>
              </a>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>تلگرام</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-7 text-neutral-600">
            برای ثبت سفارش و هماهنگی مستقیم، پیام بدهید.
            <div className="mt-4">
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" className="w-full">
                  @roghayedt
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-10">
        <CardContent className="pt-6 text-sm leading-7 text-neutral-600">
          <p className="font-semibold text-neutral-900">سفارش سفارشی چگونه است؟</p>
          <p className="mt-2">
            پس از گفتگو و توافق روی طرح، ابعاد و رنگ، برای شما بافته می‌شود. برای قطعات سفارشی بخشی از
            مبلغ به‌صورت بیعانه و مابقی در محل تحویل پرداخت می‌شود.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
