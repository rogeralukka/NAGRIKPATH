const FALLBACK_SPOT_RATE = 95.94;
const CACHE_KEY = "nagrikpath_inr_cache";

let inFlightPromise = null;
let memoryCache = null;

/**
 * Client-side live currency fetcher with 3000ms timeout, localStorage cache,
 * and 1% divergence guardrail against extreme data anomalies.
 */
export async function fetchLiveCurrencyRate() {
  if (memoryCache) {
    return memoryCache;
  }
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch("https://api.frankfurter.dev/v1/latest?from=USD&to=INR", {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const rawRate = data?.rates?.INR;
      const rate = typeof rawRate === "number" ? Number(rawRate.toFixed(2)) : FALLBACK_SPOT_RATE;

      // Divergence guardrail: discard if live rate differs from baseline by > 1%
      if (Math.abs(rate - FALLBACK_SPOT_RATE) / FALLBACK_SPOT_RATE > 0.01) {
        memoryCache = { rate: FALLBACK_SPOT_RATE, isLive: false, timestamp: Date.now() };
        return memoryCache;
      }

      const payload = { rate, isLive: true, timestamp: Date.now() };
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        }
      } catch {
        // ignore storage quota errors
      }

      memoryCache = payload;
      return payload;
    } catch (err) {
      clearTimeout(timeoutId);
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && typeof parsed.rate === "number") {
              memoryCache = { rate: parsed.rate, isLive: false, timestamp: parsed.timestamp || Date.now() };
              return memoryCache;
            }
          }
        }
      } catch {
        // ignore parse errors
      }

      memoryCache = { rate: FALLBACK_SPOT_RATE, isLive: false, timestamp: Date.now() };
      return memoryCache;
    }
  })();

  return inFlightPromise;
}

