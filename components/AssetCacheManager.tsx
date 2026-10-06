'use client';

import { useEffect } from 'react';
import { useStore } from './StoreProvider';
import { PRESET_APPLIANCE_GALLERY, resolveAssetUrl } from '@/lib/store-data';

export const FONT_CACHE_NAME = 'aleraza-fonts-cache-v1';
export const IMAGE_CACHE_NAME = 'aleraza-images-cache-v1';

export async function warmUpBrowserAssetCache(imageUrls: string[]) {
  if (typeof window === 'undefined') return { cachedImages: 0, cachedFonts: 0 };

  let cachedImages = 0;
  let cachedFonts = 0;

  try {
    if ('caches' in window) {
      // 1. Cache all product & preset images in CacheStorage
      const imgCache = await window.caches.open(IMAGE_CACHE_NAME);
      for (const rawUrl of imageUrls) {
        if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.startsWith('data:')) continue;
        try {
          const existing = await imgCache.match(rawUrl);
          if (!existing) {
            const isExternal = rawUrl.startsWith('http') && !rawUrl.startsWith(window.location.origin);
            const req = new Request(rawUrl, {
              mode: isExternal ? 'no-cors' : 'same-origin',
              cache: 'force-cache',
            });
            const res = await fetch(req);
            if (res && (res.status === 200 || res.type === 'opaque')) {
              await imgCache.put(rawUrl, res);
            }
          }
          cachedImages++;
        } catch {
          // Ignore individual fetch errors
        }
      }

      // 2. Discover & cache loaded WOFF2/TTF font resources in CacheStorage
      const fontCache = await window.caches.open(FONT_CACHE_NAME);
      if ('performance' in window && typeof window.performance.getEntriesByType === 'function') {
        const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const fontUrls = resources
          .map((r) => r.name)
          .filter(
            (name) =>
              /\.(woff2?|ttf|otf)(\?.*)?$/i.test(name) ||
              name.includes('fonts.gstatic.com') ||
              name.includes('_next/static/media')
          );

        for (const fontUrl of fontUrls) {
          try {
            const existingFont = await fontCache.match(fontUrl);
            if (!existingFont) {
              const res = await fetch(fontUrl, { cache: 'force-cache' });
              if (res && (res.status === 200 || res.type === 'opaque')) {
                await fontCache.put(fontUrl, res);
              }
            }
            cachedFonts++;
          } catch {
            // Ignore individual font fetch errors
          }
        }
      }
    }
  } catch {
    // CacheStorage may be restricted in some private modes
  }

  return { cachedImages, cachedFonts };
}

export function AssetCacheManager() {
  const { products } = useStore();

  // 1. Register Service Worker for persistent CacheStorage of Fonts & Images
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(resolveAssetUrl('/sw-cache.js'), { scope: resolveAssetUrl('/') })
        .catch(() => {
          // Fallback to direct CacheStorage warming below
        });
    }

    // Ensure web fonts are loaded and cached in browser font engine
    if ('fonts' in document && document.fonts?.ready) {
      document.fonts.ready.catch(() => {});
    }
  }, []);

  // 2. Proactively cache all product carousel images & fonts in Service Worker, CacheStorage & Memory
  useEffect(() => {
    if (typeof window === 'undefined' || !products || products.length === 0) return;

    const allImageUrls = Array.from(
      new Set(
        [
          '/images/aleraza_hero_kitchen.jpg',
          ...products.flatMap((p) => p.images || []),
          ...PRESET_APPLIANCE_GALLERY.map((g) => g.url),
        ]
          .filter((url) => url && !url.startsWith('data:'))
          .map((url) => resolveAssetUrl(url))
      )
    );

    // Send URLs to Service Worker CacheStorage
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PRECACHE_IMAGES',
        urls: allImageUrls,
      });
    }

    // Directly warm up CacheStorage for both Images & Fonts
    warmUpBrowserAssetCache(allImageUrls);

    // Warm up browser memory cache for instant 0ms carousel transitions
    const timers: number[] = [];
    allImageUrls.forEach((url, index) => {
      const t = window.setTimeout(() => {
        const img = new window.Image();
        img.decoding = 'async';
        img.src = url;
      }, index * 80);
      timers.push(t);
    });

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [products]);

  return null;
}
