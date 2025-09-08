import { ref, watchEffect } from 'vue';

export function useFavorites() {
  const FAVORITES_STORAGE_KEY = 'mapa-salas-favoritos';

  const initialFavorites = (() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (e) {
      console.error("Failed to load favorites from localStorage on initialization", e);
      return [];
    }
  })();

  const favorites = ref<string[]>(initialFavorites);

  watchEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites.value));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  });

  const isFavorited = (aulaId: string) => {
    return favorites.value.includes(aulaId);
  };

  const toggleFavorite = (aulaId: string) => {
    if (isFavorited(aulaId)) {
      favorites.value = favorites.value.filter(id => id !== aulaId);
    } else {
      favorites.value = [...favorites.value, aulaId];
    }
  };

  return {
    favorites,
    isFavorited,
    toggleFavorite,
  };
}
