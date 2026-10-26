/**
 * Service to search real books from Open Library and Google Books public APIs.
 * Requires no API keys for standard search requests.
 */

// Preset color palettes matching Phyllon's aesthetic for books that lack covers
const DEFAULT_PALETTES = [
  ["#294638", "#122219"],
  ["#6E2F26", "#2f1310"],
  ["#6A6944", "#26261a"],
  ["#B85F43", "#5a2616"],
  ["#35504F", "#14232a"],
  ["#6B5B4A", "#2c241c"],
  ["#7A3B34", "#2c1512"],
  ["#3F5E4C", "#1a2b22"]
];

function getRandomPalette(seed = 0) {
  return DEFAULT_PALETTES[Math.abs(seed) % DEFAULT_PALETTES.length];
}

/**
 * Search books with dual-provider fallback:
 * 1. Open Library Search API (fast, open, highly reliable, CORS & server friendly)
 * 2. Google Books API fallback
 */
async function searchExternalBooks(query) {
  if (!query || !query.trim()) {
    return [];
  }

  const encodedQuery = encodeURIComponent(query.trim());

  // Provider 1: Open Library API
  try {
    const olUrl = `https://openlibrary.org/search.json?q=${encodedQuery}&limit=10`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const olRes = await fetch(olUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'PhyllonApp/1.0 (book journal project)' }
    });
    clearTimeout(timeoutId);

    if (olRes.ok) {
      const olData = await olRes.json();
      if (olData.docs && olData.docs.length > 0) {
        return olData.docs.slice(0, 10).map((doc, index) => {
          const idSeed = (doc.key || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), index);
          return {
            externalId: doc.key ? doc.key.replace('/works/', '') : String(index),
            title: doc.title || "Untitled",
            author: (doc.author_name && doc.author_name.join(", ")) || "Unknown Author",
            description: doc.first_sentence ? doc.first_sentence[0] : (doc.subtitle || "A book found on Open Library."),
            pageCount: doc.number_of_pages_median || 320,
            coverUrl: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null,
            colors: getRandomPalette(idSeed),
            moods: doc.subject ? doc.subject.slice(0, 3) : ["Curious"],
            publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : null
          };
        });
      }
    }
  } catch (olErr) {
    console.warn("[ExternalBookService] Open Library attempt failed, trying Google Books fallback:", olErr.message);
  }

  // Provider 2: Google Books API Fallback
  try {
    const gbUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=10&printType=books`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(gbUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.items && Array.isArray(data.items)) {
        return data.items.map((item, index) => {
          const info = item.volumeInfo || {};
          const idSeed = (item.id || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), index);

          return {
            externalId: item.id,
            title: info.title || "Untitled",
            author: (info.authors && info.authors.join(", ")) || "Unknown Author",
            description: info.description || (info.subtitle || "No description available."),
            pageCount: info.pageCount || 300,
            coverUrl: (info.imageLinks && (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail)) || null,
            colors: getRandomPalette(idSeed),
            moods: info.categories ? info.categories.slice(0, 3) : ["Curious"],
            publishedDate: info.publishedDate || null
          };
        });
      }
    }
  } catch (error) {
    console.error("[ExternalBookService] All search providers failed:", error.message);
  }

  return [];
}

module.exports = {
  searchExternalBooks
};

