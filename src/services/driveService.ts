/**
 * driveService.ts — Google Drive Utility
 * Fast pagination + smart URL building + cache-friendly output
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface DriveFile {
  id: string;
  name: string;
}

// ─────────────────────────────────────────────
// FOLDER ID EXTRACT
// ─────────────────────────────────────────────
export const extractFolderId = (input: string): string => {
  const m = input.trim().match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return m?.[1] ?? input.trim();
};

// ─────────────────────────────────────────────
// URL BUILDERS
// ─────────────────────────────────────────────

/**
 * ✅ KEY FIX: googleapis.com/drive/v3/files/ID?alt=media&key=KEY
 * → Direct image bytes, NO redirect, NO lh3.googleusercontent.com
 * → No 429, no CORS issues
 */
export const buildIndexUrl = (fileId: string): string => {
  const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
  return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
};

/**
 * URL for <img> display — thumbnail, no auth needed
 */
export const buildDisplayUrl = (fileId: string, size = 's800'): string =>
  `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;

/** Legacy alias — kept for backward compat */
export const getDriveDirectLink = (fileId: string): string =>
  buildDisplayUrl(fileId);

// ─────────────────────────────────────────────
// FETCH ALL FILES — PARALLEL PAGES
// ─────────────────────────────────────────────
const fetchAllDriveFiles = async (folderId: string, apiKey: string): Promise<DriveFile[]> => {
  const buildUrl = (pageToken?: string) => {
    const u = new URL('https://www.googleapis.com/drive/v3/files');
    u.searchParams.set('q', `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`);
    u.searchParams.set('fields', 'nextPageToken,files(id,name)');
    u.searchParams.set('pageSize', '1000');
    u.searchParams.set('orderBy', 'name');
    u.searchParams.set('key', apiKey);
    if (pageToken) u.searchParams.set('pageToken', pageToken);
    return u.toString();
  };

  const allFiles: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const res = await fetch(buildUrl(pageToken));
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Drive API ${res.status}: ${msg}`);
    }
    const data = await res.json();
    if (data.files?.length) {
      allFiles.push(...data.files);
      console.log(`📄 Fetched ${allFiles.length} files...`);
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return allFiles;
};

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────
export const getDriveImageLinks = async (folderInput: string): Promise<string[]> => {
  const folderId = extractFolderId(folderInput);
  const apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
  const hasKey = apiKey && apiKey !== 'YOUR_GOOGLE_API_KEY';

  if (!hasKey) {
    console.warn('⚠️ No API key — using demo images');
    return FALLBACK_IMAGES;
  }

  try {
    const files = await fetchAllDriveFiles(folderId, apiKey);

    if (!files.length) {
      console.warn('⚠️ No images in folder:', folderId);
      return [];
    }

    console.log(`✅ ${files.length} images found in folder: ${folderId}`);

    // ✅ buildIndexUrl now uses googleapis.com direct media URL (no redirect)
    return files.map(f => buildIndexUrl(f.id));

  } catch (err) {
    console.error('❌ Drive API error:', err);
    console.warn('↩️ Falling back to demo images');
    return FALLBACK_IMAGES;
  }
};

// ─────────────────────────────────────────────
// FALLBACK DEMO IMAGES
// ─────────────────────────────────────────────
const FALLBACK_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600',
  'https://images.unsplash.com/photo-1519225495810-751783d9cfd7?auto=format&fit=crop&w=1600',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1600',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1600',
];