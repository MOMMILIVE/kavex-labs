export type DesignBrief = {
  shape: string; carat: string; metal: string; engraving: string;
  font: string; ringSize: string; name: string; phone: string;
};

/** Customer-controlled WhatsApp draft; never sends a message itself. */
export function makeConciergeLink(brief: DesignBrief) {
  const scale = brief.carat === 'Custom' || brief.carat === 'Guide me' ? brief.carat : `${brief.carat} ct`;
  const message = [
    'KAVEX LABS — PRIVATE DESIGN BRIEF',
    `Name: ${brief.name.trim()}`, `WhatsApp: ${brief.phone.trim()}`, '',
    `Diamond shape: ${brief.shape}`, `Scale: ${scale}`, `Metal: ${brief.metal}`,
    `Ring size: ${brief.ringSize}`,
    `Engraving: ${brief.engraving ? `${brief.engraving} (${brief.font})` : 'Decide together'}`, '',
    'I would like to explore the actual stones on video and refine this design with my private jeweler.',
  ].join('\n');
  return `https://wa.me/4748900083?text=${encodeURIComponent(message)}`;
}
