import type { Metadata } from "next";
import { Header, Footer } from "../../components/Brand";
import VaultQuiz from "../../components/VaultQuiz";

export const metadata: Metadata = {
  title: "Request Vault Allocation",
  description:
    "Create a private brief in five steps and connect with the Kavex Labs concierge on WhatsApp.",
};
export default function VaultAllocation() {
  return (
    <>
      <Header />
      <main id="main" className="vault-page shell">
        <div className="edition-line micro">
          <span>
            <span className="status-dot" /> PRIVATE COMMISSIONS
          </span>
          <span>KAVEX LABS / DIRECT ACCESS</span>
        </div>
        <VaultQuiz />
      </main>
      <Footer />
    </>
  );
}
