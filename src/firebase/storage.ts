'use client';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useFirebase } from './provider';

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The path where the file should be stored in Firebase Storage.
 * @returns A promise that resolves with the snapshot and download URL.
 */
export const uploadFile = async (file: File, path: string) => {
    // This is a bit of a hack to get the storage instance from the provider.
    // In a real app, you might pass the storage instance around or have a different way to access it.
    const storage = getStorage(useFirebase().firebaseApp);
    const storageRef = ref(storage, path);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { snapshot, downloadURL };
};
