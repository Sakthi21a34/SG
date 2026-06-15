// IndexedDB and LocalStorage Utility for Safety Guard Offline Sync

const DB_NAME = "SafetyGuardOfflineDB";
const STORE_NAME = "mutation_queue";
const DB_VERSION = 1;

function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Adds an item to the synchronization queue
 * @param {string} type - 'checkin', 'checkout', 'issue', 'incident'
 * @param {object} data - Action data payloads (can include Blobs/Files)
 */
export async function addToQueue(type, data) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(transaction.objectStoreNames[0]);
    const record = {
      type,
      data,
      timestamp: new Date().toISOString()
    };
    const request = store.add(record);

    request.onsuccess = () => resolve(true);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Retrieves all items in the queue
 */
export async function getQueue() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (e) => resolve(e.target.result || []);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Removes an item from the queue by ID
 */
export async function removeFromQueue(id) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * LocalStorage caching helpers for offline read-only lists
 */
export function setCached(key, value) {
  try {
    localStorage.setItem(`sg_cache_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Error writing to localStorage cache", e);
  }
}

export function getCached(key, fallback = null) {
  try {
    const data = localStorage.getItem(`sg_cache_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error("Error reading from localStorage cache", e);
    return fallback;
  }
}
