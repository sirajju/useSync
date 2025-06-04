/**
 * IndexedDB utility for useSync
 * Handles storing and retrieving API responses from IndexedDB
 */

const DB_NAME = 'useSyncCache';
const STORE_NAME = 'apiResponses';
const DB_VERSION = 1;

let dbPromise = null;

/**
 * Initialize the IndexedDB database
 */
const initializeDB = () => {
  if (dbPromise) return dbPromise;
  
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      reject(`IndexedDB error: ${event.target.error}`);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
  
  return dbPromise;
};

/**
 * Store data in IndexedDB
 */
export const storeInIndexedDB = async (key, data, expiresAt) => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const entry = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt
    };
    
    return new Promise((resolve, reject) => {
      const request = store.put(entry);
      
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(`Error storing data: ${e.target.error}`);
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = (e) => reject(`Transaction error: ${transaction.error}`);
    });
  } catch (error) {
    console.error('IndexedDB store error:', error);
    throw error;
  }
};

/**
 * Retrieve data from IndexedDB
 */
export const getFromIndexedDB = async (key) => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      
      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result) {
          // Check if entry is expired
          if (Date.now() > result.expiresAt) {
            // If expired, delete it and return null
            deleteFromIndexedDB(key).catch(console.error);
            resolve(null);
          } else {
            resolve(result);
          }
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (e) => reject(`Error retrieving data: ${e.target.error}`);
    });
  } catch (error) {
    console.error('IndexedDB get error:', error);
    return null;
  }
};

/**
 * Delete data from IndexedDB
 */
export const deleteFromIndexedDB = async (key) => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(`Error deleting data: ${e.target.error}`);
    });
  } catch (error) {
    console.error('IndexedDB delete error:', error);
    throw error;
  }
};

/**
 * Clear all data from the cache store
 */
export const clearIndexedDBCache = async () => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(`Error clearing cache: ${e.target.error}`);
    });
  } catch (error) {
    console.error('IndexedDB clear cache error:', error);
    throw error;
  }
};

/**
 * Clean expired entries from IndexedDB
 * This function scans through all entries and removes the ones that have expired
 */
export const cleanExpiredIndexedDBCache = async () => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    let expiredCount = 0;
    const now = Date.now();
    
    return new Promise((resolve, reject) => {
      // Open a cursor to iterate through all entries
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          // Check if this entry is expired
          const entry = cursor.value;
          if (entry.expiresAt && now > entry.expiresAt) {
            // Delete the expired entry
            const deleteRequest = cursor.delete();
            deleteRequest.onsuccess = () => {
              expiredCount++;
            };
          }
          // Move to the next entry
          cursor.continue();
        } else {
          // No more entries to process, we're done
          console.log(`Cleaned up ${expiredCount} expired entries from IndexedDB`);
          resolve({ removed: expiredCount });
        }
      };
      
      request.onerror = (e) => {
        console.error('Error in cleanExpiredIndexedDBCache:', e.target.error);
        reject(`Error cleaning expired entries: ${e.target.error}`);
      };
      
      transaction.oncomplete = () => {
        resolve({ removed: expiredCount });
      };
      
      transaction.onerror = (e) => {
        reject(`Transaction error: ${transaction.error}`);
      };
    });
  } catch (error) {
    console.error('Error cleaning IndexedDB cache:', error);
    return { removed: 0 };
  }
};
