// This file contains the data for the toolbox cards, including their images, names, descriptions, categories, platforms, ratings, links, and devices.
export let cardsData = [];

// Fetch tools list from API, adapt data and populate cardsData array
export async function loadCardsData() {
  try {
    const res = await fetch('http://localhost:3001/api/tools');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    // Accept either an array or an object { tools: [...] }
    const data = Array.isArray(raw) ? raw : raw?.tools ?? raw?.data ?? [];

    // Map to frontend expected format
    const mapped = (Array.isArray(data) ? data : []).map((card) => {
      // Debug: console.log('Raw card from API:', card);
      return {
        // Prefer backend-specific fields first
        id: card.ID_Tools ?? card.id ?? card.ID ?? null,
        userId: card.ID_User ?? card.userId ?? null,  // ID of the user who created the tool
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
      description: (() => {
        const rawDesc = card.Description_Tools ?? card.description ?? card.desc ?? '';
        // Clean description by removing hidden OS data
        return rawDesc
          .replace(/\[HIDDEN_OS:[^\]]*\]/g, '') // Remove [HIDDEN_OS:...]
          .replace(/\s*-\s*OS:\s*[^-\n]*$/g, '') // Also remove old format "- OS: ..."
          .trim();
      })(),
      // Category can come from the joined Name_Category alias or other variants
      category: card.Name_Category ?? card.name_category ?? card.categorie ?? card.category ?? card.Category ?? 'Divers',
      platform: (() => {
        // Get OS from Name_OS field
        const osString = card.Name_OS || '';
        
        // If no OS in database, try to get from description
        let osToProcess = osString;
        if (!osString && card.Description_Tools) {
          // First look for new hidden format [HIDDEN_OS:...]
          const hiddenOSMatch = card.Description_Tools.match(/\[HIDDEN_OS:([^\]]+)\]/);
          if (hiddenOSMatch) {
            osToProcess = hiddenOSMatch[1].trim();
          } else if (card.Description_Tools.includes('OS:')) {
            // Fallback to old format "- OS: ..."
            const osMatch = card.Description_Tools.match(/OS:\s*([^-\n]+)/);
            if (osMatch) {
              osToProcess = osMatch[1].trim();
            }
          }
        }
        
        // If still no OS, return empty array
        if (!osToProcess) {
          return [];
        }
        
        // Split by commas and clean
        return osToProcess.split(',').map(os => {
          const osName = os.trim().toLowerCase();
          let icon = '';
          
          // Associate each OS with its icon
          if (osName.includes('windows')) {
            icon = 'Assets/Platform Icon/icons8-windows-os.svg';
          } else if (osName.includes('macos') || osName.includes('mac')) {
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
        }).filter(os => os.name && os.icon);  // Keep only OS with valid icons
      })(),
      rating: (() => {
        // Get rating from Stars field
        const stars = card.Stars || '0';
        // Convert to number
        const num = parseFloat(stars);
        return !isNaN(num) ? Math.min(Math.max(num, 0), 5) : 1;
      })(),
      link: card.Link_Tools ?? card.link ?? card.url ?? card.URL ?? '',
      device: card.device ?? card.devices ?? '',
      Platform_Name: card.Platform_Name ?? ''
      };
    });

    cardsData.splice(0, cardsData.length, ...mapped); // Keep the reference
    console.log("Loaded cardsData:", cardsData);
    return cardsData;
  } catch (err) {
    console.error('Failed to load cards:', err);
    return cardsData;
  }
}

// Automatic loading on first import
try {
  await loadCardsData();
  console.log('Initial cardsData load:', cardsData);
} catch (err) {
  console.error('Failed initial cardsData load:', err);
}