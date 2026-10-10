import type { Metadata } from "next";
import VaultPage from "../../../components/VaultPage";

export const metadata: Metadata = {
  title: "Request Vault Allocation",
  alternates: {
    canonical: "/vault-allocation",
    languages: {
      en: "/vault-allocation",
      ar: "/ar/vault-allocation",
      nb: "/no/vault-allocation",
    },
  },
  description:
    "Create a private brief in five steps and connect with the Kavex Labs concierge on WhatsApp.",
};
export default function VaultAllocation() {
  return <VaultPage />;
}
