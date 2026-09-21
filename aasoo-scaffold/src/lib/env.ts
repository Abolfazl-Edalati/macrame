import "server-only";

function required(key: string, fallback?: string): string {
  const v = process.env[key] ?? fallback;
  if (v === undefined) throw new Error(`Missing env var: ${key}`);
  return v;
}

export const env = {
  ADMIN_PASSWORD: required("ADMIN_PASSWORD", "admin"),
  // Telegram alerting for new orders
  TELEGRAM_BOT_TOKEN: required("TELEGRAM_BOT_TOKEN"),
  TELEGRAM_CHAT_ID: required("TELEGRAM_CHAT_ID"),
  SQLITE_FILE: required("SQLITE_FILE", "aasoo.db"),
  SHIPPING_FLAT_TOMAN: Number(process.env.SHIPPING_FLAT_TOMAN ?? 0),
};
