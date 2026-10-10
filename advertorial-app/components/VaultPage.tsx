import { translate, type Language } from "../lib/i18n";
import { Header, Footer } from "./Brand";
import { getQuizMessages } from "../lib/quiz-messages";
import VaultQuiz from "./VaultQuiz";
export default function VaultPage({
  language = "en",
}: {
  language?: Language;
}) {
  const t = (text: string) => translate(language, text);
  return (
    <>
      <Header language={language} page="vault-allocation" />
      <main id="main" className="vault-page shell">
        <div className="edition-line micro">
          <span>
            <span className="status-dot" /> {t("PRIVATE COMMISSIONS")}
          </span>
          <span>{t("KAVEX LABS / DIRECT ACCESS")}</span>
        </div>
        <VaultQuiz language={language} messages={getQuizMessages(language)} />
      </main>
      <Footer language={language} />
    </>
  );
}
