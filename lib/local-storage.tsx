// OOP wrapper around localStorage with SSR safety and JSON serialization.
type Storable = unknown;

class LocalStorageService {
  private storage: Storage | null;

  constructor(storage?: Storage) {
    const isBrowser =
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined";
    this.storage = isBrowser ? storage ?? window.localStorage : null;
  }

  get isAvailable() {
    return this.storage !== null;
  }

  setItem(key: string, value: Storable): void {
    if (!this.storage) return;
    try {
      const payload = value === undefined ? null : value;
      this.storage.setItem(key, JSON.stringify(payload));
    } catch (error) {
      this.log("setItem", error);
    }
  }

  getItem<T = unknown>(key: string, fallback?: T): T | null {
    if (!this.storage) return fallback ?? null;
    try {
      const raw = this.storage.getItem(key);
      if (raw === null) return fallback ?? null;
      return JSON.parse(raw) as T;
    } catch (error) {
      this.log("getItem", error);
      return fallback ?? null;
    }
  }

  removeItem(key: string): void {
    if (!this.storage) return;
    try {
      this.storage.removeItem(key);
    } catch (error) {
      this.log("removeItem", error);
    }
  }

  clear(): void {
    if (!this.storage) return;
    try {
      this.storage.clear();
    } catch (error) {
      this.log("clear", error);
    }
  }

  private log(action: string, error: unknown) {
    // Keep logging minimal to avoid noisy consoles in production.
    console.warn(`localStorage ${action} failed`, error);
  }
}

// Export a shared instance for convenience.
export const localStorageService = new LocalStorageService();

// Helper functions if a functional style is preferred.
export const setItem = <T = unknown,>(key: string, value: T) =>
  localStorageService.setItem(key, value);

export const getItem = <T = unknown,>(key: string, fallback?: T) =>
  localStorageService.getItem<T>(key, fallback);

export const removeItem = (key: string) => localStorageService.removeItem(key);

export const clearStorage = () => localStorageService.clear();
