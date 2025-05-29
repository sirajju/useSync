/**
 * IndexedDB utility for useSync
 * Handles storing and retrieving API responses from IndexedDB
 */

const DB_NAME = 'useSyncCache';
const STORE_NAME = 'apiResponses';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Initialize the IndexedDB database
 */
const initializeDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;
  
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      reject(`IndexedDB error: ${(event.target as IDBRequest).error}`);
    };
    
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result;
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
export const storeInIndexedDB = async (key: string, data: any, expiresAt: number): Promise<void> => {
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
      request.onerror = (e) => reject(`Error storing data: ${(e.target as IDBRequest).error}`);
      
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
export const getFromIndexedDB = async (key: string): Promise<{data: any, timestamp: number, expiresAt: number} | null> => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      
      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
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
      
      request.onerror = (e) => reject(`Error retrieving data: ${(e.target as IDBRequest).error}`);
    });
  } catch (error) {
    console.error('IndexedDB get error:', error);
    return null;
  }
};

/**
 * Delete data from IndexedDB
 */
export const deleteFromIndexedDB = async (key: string): Promise<void> => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(`Error deleting data: ${(e.target as IDBRequest).error}`);
    });
  } catch (error) {
    console.error('IndexedDB delete error:', error);
    throw error;
  }
};

/**
 * Clear all data from the cache store
 */
export const clearIndexedDBCache = async (): Promise<void> => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(`Error clearing cache: ${(e.target as IDBRequest).error}`);
    });
  } catch (error) {
    console.error('IndexedDB clear cache error:', error);
    throw error;
  }
};
