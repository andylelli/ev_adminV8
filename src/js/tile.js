import JSZip from 'jszip';
import Dexie from 'dexie';

// Initialize Dexie
export const tile = new Dexie('tiles');
tile.version(1).stores({
  tileFiles: 'id, z, y, x, data'
});

export async function downloadAndStoreTileZip(zipUrl) {
  try {
    const response = await fetch(`${zipUrl}?v=${Date.now()}`);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

    const buffer = await response.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);

    const tiles = [];
    const promises = [];

    zip.forEach((path, file) => {
      const parts = file.name.split('/');
      if (file.name.endsWith('.jpg') && parts.length === 3) {
        const [z, y, xFile] = parts;
        const x = xFile.replace('.jpg', '');
        const id = `${z}-${y}-${x}`;

        const promise = file.async("uint8array").then((data) => {
          tiles.push({
            z: parseInt(z),
            y: parseInt(y),
            x: parseInt(x),
            data,
            id
          });
        });

        promises.push(promise);
      }
    });

    await Promise.all(promises);

    await tile.table('tileFiles').clear();
    await tile.table('tileFiles').bulkPut(tiles);

    return tiles.length;

  } catch (err) {
    throw err;
  }
}
