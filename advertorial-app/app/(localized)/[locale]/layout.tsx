import DocumentLayout from "../../../components/DocumentLayout";
import { getLanguage } from "../../../lib/i18n";
export { metadata, viewport } from "../../../components/DocumentLayout";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <DocumentLayout language={getLanguage((await params).locale)}>
      {children}
    </DocumentLayout>
  );
}
