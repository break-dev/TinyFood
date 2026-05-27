// @ts-ignore - La librería no provee tipos nativos
import { getImageMime } from 'base64-image-mime';

/**
 * Detecta el mimetype a partir de un string base64 usando la librería "base64-image-mime".
 */
export async function getMimeType(base64: string): Promise<[string, string]> {
  const mime = getImageMime(base64) || 'image/jpeg';
  let ext = mime.split('/')[1] || 'jpg';
  if (ext === 'jpeg') ext = 'jpg';
  return [mime, ext];
}
