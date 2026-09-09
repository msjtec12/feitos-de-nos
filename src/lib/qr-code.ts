import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

/**
 * Gera Data URL (PNG base64) de um QR Code em alta definição
 */
export async function generateQRCodeDataUrl(
  url: string,
  options?: QRCodeOptions
): Promise<string> {
  const width = options?.width || 600;
  const margin = options?.margin !== undefined ? options?.margin : 2;
  const dark = options?.darkColor || '#713C48';
  const light = options?.lightColor || '#FFFFFF';

  return QRCode.toDataURL(url, {
    width,
    margin,
    errorCorrectionLevel: 'H',
    color: {
      dark,
      light,
    },
  });
}

/**
 * Gera string SVG de um QR Code vetorial nítido
 */
export async function generateQRCodeSvg(
  url: string,
  options?: QRCodeOptions
): Promise<string> {
  const margin = options?.margin !== undefined ? options?.margin : 2;
  const dark = options?.darkColor || '#713C48';
  const light = options?.lightColor || '#FFFFFF';

  return QRCode.toString(url, {
    type: 'svg',
    margin,
    errorCorrectionLevel: 'H',
    color: {
      dark,
      light,
    },
  });
}

/**
 * Retorna a URL pública completa de uma página de presente a partir do token
 */
export function getGiftPagePublicUrl(publicToken: string): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://feitos-de-nos.vercel.app';
  const cleanBase = siteUrl.replace(/\/+$/, '');
  return `${cleanBase}/p/${publicToken}`;
}
