// Persian-first formatting helpers. Toman amounts as integers; full toman display.

const tomanFmt = new Intl.NumberFormat("fa-IR");

/** Integer toman -> "۱٬۲۵۰٬۰۰۰ تومان" */
export function formatToman(toman: number): string {
  return `${tomanFmt.format(toman)} تومان`;
}

/** Integer toman -> "۱٬۲۵۰٬۰۰۰" (no currency suffix) */
export function formatTomanBare(toman: number): string {
  return tomanFmt.format(toman);
}

const dateFmt = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "full",
});

/** Unix seconds -> Persian date string */
export function formatPersianDate(unixSeconds: number): string {
  return dateFmt.format(new Date(unixSeconds * 1000));
}
