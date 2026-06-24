import { darkSkin } from './dark';
import { defaultSkin } from './default';
import type { SkinDefinition, SkinId } from './types';

export const skins: Record<SkinId, SkinDefinition> = {
  default: defaultSkin,
  dark: darkSkin,
};

export const skinList: SkinDefinition[] = Object.values(skins);

export const DEFAULT_SKIN_ID: SkinId = 'default';

export const SKIN_STORAGE_KEY = 'event-system-pro.skin-id';

export type { SkinDefinition, SkinId };
