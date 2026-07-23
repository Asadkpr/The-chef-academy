import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAyNPo7Qvo8F3nVY-oSkts5Hyq_PvJn3O8",
  authDomain: "thechefacademy-565d2.firebaseapp.com",
  projectId: "thechefacademy-565d2",
  storageBucket: "thechefacademy-565d2.firebasestorage.app",
  messagingSenderId: "852173198710",
  appId: "1:852173198710:web:9f9d072229c47619069657",
  measurementId: "G-M8GSFXS9Q4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Primary Storage Bucket
export const storage = getStorage(app);

// Dynamic Backup Storage Bucket Suffix detection
const defaultBucket = firebaseConfig.storageBucket;
const backupBucket = defaultBucket.endsWith('.firebasestorage.app') 
  ? defaultBucket.replace('.firebasestorage.app', '.appspot.com')
  : defaultBucket.replace('.appspot.com', '.firebasestorage.app');

export const storageBackup = getStorage(app, `gs://${backupBucket}`);

/**
 * Helper to upload bytes with a timeout to prevent hanging forever
 */
const uploadBytesWithTimeout = async (storageInstance: any, path: string, blob: Blob, fileType: string, timeoutMs = 4000): Promise<string> => {
  const storageRef = ref(storageInstance, path);
  
  const uploadPromise = (async () => {
    const uploadResult = await uploadBytes(storageRef, blob, { contentType: fileType });
    return await getDownloadURL(uploadResult.ref);
  })();

  const timeoutPromise = new Promise<string>((_, reject) => 
    setTimeout(() => reject(new Error(`Upload timed out after ${timeoutMs}ms`)), timeoutMs)
  );

  return await Promise.race([uploadPromise, timeoutPromise]);
};

/**
 * Uploads a file (or base64 string) to Firebase Storage (with backup domain suffix fallback and fast timeout).
 * Falls back to local server upload or processed Base64 data URL if Firebase Storage fails or hangs.
 */
export const uploadFile = async (fileOrBase64: File | string, fileName: string): Promise<string> => {
  try {
    let fileBlob: Blob;
    let finalFileName = fileName;
    let finalFileType = 'image/jpeg';

    if (fileOrBase64 instanceof File) {
      fileBlob = fileOrBase64;
      finalFileName = fileOrBase64.name;
      finalFileType = fileOrBase64.type;
    } else {
      // If it's a base64 data URL, convert it to a blob
      const response = await fetch(fileOrBase64);
      fileBlob = await response.blob();
      finalFileType = fileBlob.type || 'image/jpeg';
    }

    const timestamp = Date.now();
    const cleanName = finalFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `uploads/${timestamp}_${cleanName}`;

    // 1. Try local raw binary upload first (Fastest!)
    try {
      const response = await fetch('/api/upload-raw', {
        method: 'POST',
        headers: {
          'x-file-name': encodeURIComponent(fileName),
          'content-type': finalFileType,
        },
        body: fileBlob,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.url) {
          console.log("Uploaded successfully to local server raw:", result.url);
          return result.url;
        }
      }
    } catch (rawError: any) {
      console.warn("Local raw binary upload failed, falling back to Firebase Storage:", rawError);
    }

    // 2. Try Primary Firebase Storage (firebasestorage.app suffix)
    try {
      console.log(`Attempting upload to Primary Firebase Storage: ${defaultBucket}`);
      const downloadUrl = await uploadBytesWithTimeout(storage, storagePath, fileBlob, finalFileType, 4000);
      console.log("Uploaded successfully to Primary Firebase Storage:", downloadUrl);
      return downloadUrl;
    } catch (primaryError: any) {
      console.warn("Primary Firebase Storage upload failed or timed out:", primaryError.message || primaryError);

      // 3. Try Backup Firebase Storage (appspot.com suffix)
      try {
        console.log(`Attempting upload to Backup Firebase Storage: ${backupBucket}`);
        const downloadUrl = await uploadBytesWithTimeout(storageBackup, storagePath, fileBlob, finalFileType, 4000);
        console.log("Uploaded successfully to Backup Firebase Storage:", downloadUrl);
        return downloadUrl;
      } catch (backupError: any) {
        console.warn("Backup Firebase Storage upload also failed or timed out:", backupError.message || backupError);
      }
    }

    // 4. Fallback to base64 JSON /api/upload
    let base64Data: string;
    if (typeof fileOrBase64 === 'string') {
      base64Data = fileOrBase64;
    } else {
      base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file for fallback upload"));
        reader.readAsDataURL(fileOrBase64);
      });
    }

    try {
      const fallbackResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: fileName,
          fileType: typeof fileOrBase64 === 'string' ? 'image/jpeg' : (fileOrBase64 as File).type,
          fileData: base64Data,
        }),
      });

      if (fallbackResponse.ok) {
        const result = await fallbackResponse.json();
        if (result.success && result.url) {
          console.log("Uploaded successfully to local server fallback base64:", result.url);
          return result.url;
        }
      }
    } catch (fallbackError) {
      console.warn("Local base64 upload failed:", fallbackError);
    }

    // 5. Ultimate Fail-Safe: If fileOrBase64 is a base64 URL string, return it directly so upload NEVER blocks or fails!
    if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
      console.log("Returning processed Base64 data URL directly as ultimate fail-safe fallback.");
      return fileOrBase64;
    }

    throw new Error("All upload methods failed");
  } catch (storageError: any) {
    console.warn("Storage upload process error:", storageError);
    if (typeof fileOrBase64 === 'string' && fileOrBase64.startsWith('data:')) {
      return fileOrBase64;
    }
    throw storageError;
  }
};

