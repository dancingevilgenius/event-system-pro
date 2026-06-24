import { darkSkin } from './dark';
import { lightSkin } from './light';
import type { SkinDefinition, SkinId } from './types';

export const skins: Record<SkinId, SkinDefinition> = {
  light: lightSkin,
  dark: darkSkin,
};

export const skinList: SkinDefinition[] = Object.values(skins);

export const DEFAULT_SKIN_ID: SkinId = 'light';

export const SKIN_STORAGE_KEY = 'event-system-pro.skin-id';

export type { SkinDefinition, SkinId };
