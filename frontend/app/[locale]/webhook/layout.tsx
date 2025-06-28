import { routing } from "@/i18n/routing";

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }));
}

export default function WebhookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}