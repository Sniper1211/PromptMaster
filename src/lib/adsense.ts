export const ADSENSE_CLIENT = 'ca-pub-9245714228354292';

// Replace these with real AdSense slot IDs after creating ad units in the AdSense dashboard.
export const ADSENSE_SLOTS = {
  promptGridInFeed: '',
  promptDetailInline: '',
  promptDetailSidebar: ''
} as const;

export const isValidAdSlot = (slotId?: string) => /^\d+$/.test(slotId ?? '');
