export const diamondShapes = ['Oval', 'Emerald', 'Radiant', 'Round', 'Pear'] as const;
export type DiamondShape = typeof diamondShapes[number];
export type CatalogLead = { name: string; phone: string; shape: DiamondShape };

export function parseCatalogLead(value: unknown): CatalogLead | null {
  if (!value || typeof value !== 'object') return null;
  const lead = value as Record<string, unknown>;
  if (typeof lead.name !== 'string' || typeof lead.phone !== 'string' || typeof lead.shape !== 'string') return null;
  const name = lead.name.trim().replace(/\s+/g, ' ');
  const phone = lead.phone.trim();
  const digits = phone.replace(/\D/g, '');
  if (name.length < 2 || name.length > 100 || /[\u0000-\u001f\u007f]/.test(name)) return null;
  if (!/^\+?[\d ()-]+$/.test(phone) || digits.length < 7 || digits.length > 15 || phone.length > 32) return null;
  if (!diamondShapes.includes(lead.shape as DiamondShape)) return null;
  return { name, phone: (phone.startsWith('+') ? '+' : '') + digits, shape: lead.shape as DiamondShape };
}

export function catalogWhatsAppLink(lead: CatalogLead) {
  const message = `KAVEX LABS — 2026 CATALOG REQUEST\nName: ${lead.name}\nPhone: ${lead.phone}\nDiamond shape: ${lead.shape}\nPlease share the 2026 pricing catalog.`;
  return `https://wa.me/4748900083?text=${encodeURIComponent(message)}`;
}
