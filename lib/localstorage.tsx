"use client";
export class LocalStorage {
  /**
   * Check if we're in browser environment
   */
  static isAvailable(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }

  /**
   * Safely set item in localStorage
   */
  static setItem(key: string, value: string): boolean {
    try {
      if (!this.isAvailable()) return false;
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn("LocalStorage.setItem failed:", error);
      return false;
    }
  }

  /**
   * Safely get item from localStorage
   */
  static getItem(key: string): string | null {
    try {
      if (!this.isAvailable()) return null;
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("LocalStorage.getItem failed:", error);
      return null;
    }
  }

  /**
   * Safely remove item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      if (!this.isAvailable()) return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn("LocalStorage.removeItem failed:", error);
      return false;
    }
  }

  /**
   * Safely clear all localStorage
   */
  static clear(): boolean {
    try {
      if (!this.isAvailable()) return false;
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn("LocalStorage.clear failed:", error);
      return false;
    }
  }

  /**
   * Get item with JSON parsing
   */
  static getJSON<T>(key: string, fallback?: T): T | null {
    try {
      const item = this.getItem(key);
      if (item === null) return fallback || null;
      return JSON.parse(item);
    } catch (error) {
      console.warn("LocalStorage.getJSON failed:", error);
      return fallback || null;
    }
  }

  /**
   * Set item with JSON stringification
   */
  static setJSON<T>(key: string, value: T): boolean {
    try {
      const stringValue = JSON.stringify(value);
      return this.setItem(key, stringValue);
    } catch (error) {
      console.warn("LocalStorage.setJSON failed:", error);
      return false;
    }
  }
}
