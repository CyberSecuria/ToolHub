// This file contains the data for the toolbox cards, including their images, names, descriptions, categories, platforms, ratings, links, and devices.
export let cardsData = [];

// Récupère la liste depuis l'API, adapte les données et remplit le tableau `cardsData`
export async function loadCardsData() {
  try {
    const res = await fetch('http://localhost:3001/api/tools');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    // Accept either an array or an object { tools: [...] }
    const data = Array.isArray(raw) ? raw : raw?.tools ?? raw?.data ?? [];

    // Mapping vers le format attendu par le front
    const mapped = (Array.isArray(data) ? data : []).map((card) => ({
      // prefer backend-specific fields first
      id: card.ID_Tools ?? card.id ?? card.ID ?? null,
      // Normalize image path: remove leading './' and build a sensible default
      image: (() => {
        const raw =
          card.image || card.Image || card.image_url || card.imageUrl || card.ImageTools || card.Image_Tools || card.Image_Tool || '';
        let img = String(raw || '').trim();
        if (img.startsWith('./')) img = img.slice(2);
        // If only a filename was provided, assume Card Product Icons folder
        if (img && !img.includes('/') && img.includes('.')) {
          img = `Assets/Card Product Icons/${img}`;
        }
        // Fallback to a known existing asset
        if (!img) img = 'Assets/Card Product Icons/figma icon.png';
        return img;
      })(),
      alt: card.Image_Alt ?? (card.alt || card.altText || ''),
      name: card.Name_Tools ?? card.name ?? card.nom ?? card.titre ?? '',
      description: card.Description_Tools ?? card.description ?? card.desc ?? '',
      // category can come from the joined Name_Category alias or other variants
      category: card.Name_Category ?? card.name_category ?? card.categorie ?? card.category ?? card.Category ?? 'Divers',
      platform: (() => {
        // Récupérer les OS depuis Name_OS
        const osString = card.Name_OS || '';
        // Séparer par virgules et nettoyer
        return osString.split(',').map(os => {
          const osName = os.trim().toLowerCase();
          let icon = '';
          
          // Associer chaque OS avec son icône
          if (osName.includes('windows')) {
            icon = 'Assets/Platform Icon/icons8-windows-os.svg';
          } else if (osName.includes('macos')) {
            icon = 'Assets/Platform Icon/icons8-mac-os.svg';
          } else if (osName.includes('linux')) {
            icon = 'Assets/Platform Icon/linux-svgrepo-com.svg';
          } else if (osName.includes('android')) {
            icon = 'Assets/Platform Icon/icons8-android.svg';
          } else if (osName.includes('ios')) {
            icon = 'Assets/Platform Icon/icons8-ios.svg';
          }

          return {
            name: os.trim(),
            icon: icon
          };
        }).filter(os => os.name && os.icon);  // Ne garder que les OS avec des icônes valides
      })(),
      rating: (() => {
        // Récupérer le rating depuis Stars
        const stars = card.Stars || '0';
        // Convertir en nombre
        const num = parseFloat(stars);
        return !isNaN(num) ? Math.min(Math.max(num, 0), 5) : 0;
      })(),
      link: card.Link_Tools ?? card.link ?? card.url ?? card.URL ?? '',
      device: card.device ?? card.devices ?? '',
    }));

    cardsData.splice(0, cardsData.length, ...mapped); // garde la référence
    return cardsData;
  } catch (err) {
    console.error('Failed to load cards:', err);
    return cardsData;
  }
}

// Chargement automatique au premier import
try {
  await loadCardsData();
  console.log('Initial cardsData load:', cardsData);
} catch (err) {
  console.error('Failed initial cardsData load:', err);
}