
'use client';

import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';
import { getApp } from 'firebase/app';
import { initializeFirebase } from './index';

/**
 * Returns an initialized Firebase Storage instance.
 * This function should be called within a component or hook to ensure
 * the Firebase app is initialized.
 * @returns The Firebase Storage instance.
 */
export const getStorageInstance = (): FirebaseStorage => {
    // getApp() will throw if the app is not initialized.
    // initializeFirebase() is idempotent and will either initialize or get the existing app.
    try {
        return getStorage(getApp());
    } catch (e) {
        const { storage } = initializeFirebase();
        return storage;
    }
};

/**
 * Uploads a file to Firebase Storage.
 * @param storage The Firebase Storage instance.
 * @param file The file to upload.
 * @param path The path where the file should be stored in Firebase Storage.
 * @returns A promise that resolves with the snapshot and download URL.
 */
export const uploadFile = async (storage: FirebaseStorage, file: File, path: string) => {
    const storageRef = ref(storage, path);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { snapshot, downloadURL };
};
