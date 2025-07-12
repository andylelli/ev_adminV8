import L from "leaflet";
import { tile } from "./tile"; // ✅ Use the new DB

export function createOfflineTileLayer() {
  return L.TileLayer.extend({
    getTileUrl(coords) {
      const z = coords.z;
      const x = coords.x;
      const y = coords.y;
      const id = `${z}-${y}-${x}`; // ✅ Matches how you saved it

      return new Promise((resolve, reject) => {
        tile.table("tileFiles") // Ensure this matches your IndexedDB table
          .get(id)
          .then((result) => {
            if (result && result.data) {
              const blob = new Blob([result.data], { type: "image/jpeg" });
              const blobUrl = URL.createObjectURL(blob);
              console.log("✅ Found tile:", id);
              resolve(blobUrl);
            } else {
              console.warn("❌ Missing tile:", id);
              reject("Tile not found");
            }
          })
          .catch((err) => {
            console.error("Error retrieving tile:", id, err);
            reject(err);
          });
      });
    },
    createTile(coords, done) {
      const tileImg = document.createElement("img");
      tileImg.alt = "";
      tileImg.setAttribute("role", "presentation");
      tileImg.style.background = "transparent"; // Optional: remove default bg
      tileImg.style.display = "none"; // Start hidden

      this.getTileUrl(coords)
        .then((url) => {
          tileImg.src = url;
          tileImg.style.display = "block"; // Only show if tile loads
        })
        .catch(() => {
          // Tile not found — leave it hidden
          tileImg.style.display = "none";
        })
        .finally(() => done(null, tileImg));

      return tileImg;
    }
  });
}
