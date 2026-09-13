export type SpotifyResourceType = 'track' | 'album' | 'playlist' | 'artist' | 'episode' | 'show';

export interface ParsedSpotifyUrl {
  type: SpotifyResourceType;
  id: string;
  canonicalUrl: string;
  embedUrl: string;
}

const RESOURCE_TYPES = new Set<SpotifyResourceType>([
  'track',
  'album',
  'playlist',
  'artist',
  'episode',
  'show',
]);

export function parseSpotifyUrl(input?: string | null): ParsedSpotifyUrl | null {
  const value = (input || '').trim();
  if (!value) return null;

  if (value.startsWith('spotify:')) {
    const [, rawType, id] = value.split(':');
    const type = rawType as SpotifyResourceType;
    if (!RESOURCE_TYPES.has(type) || !id || !/^[A-Za-z0-9]+$/.test(id)) return null;
    return buildResult(type, id);
  }

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'open.spotify.com') {
      return null;
    }

    const parts = url.pathname.split('/').filter(Boolean);
    const typeIndex = parts.findIndex((part) => RESOURCE_TYPES.has(part as SpotifyResourceType));
    if (typeIndex < 0) return null;

    const type = parts[typeIndex] as SpotifyResourceType;
    const id = parts[typeIndex + 1];
    if (!id || !/^[A-Za-z0-9]+$/.test(id)) return null;

    return buildResult(type, id);
  } catch {
    return null;
  }
}

function buildResult(type: SpotifyResourceType, id: string): ParsedSpotifyUrl {
  const canonicalUrl = `https://open.spotify.com/${type}/${id}`;
  return {
    type,
    id,
    canonicalUrl,
    embedUrl: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`,
  };
}

export function isSpotifyUrl(input?: string | null): boolean {
  return parseSpotifyUrl(input) !== null;
}
