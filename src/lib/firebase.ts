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
const uploadBytesWithTimeout = async (storageInstance: any, path: string, blob: Blob, fileType: string, timeoutMs = 3000): Promise<string> => {
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
 * Uploads a file (or base64 string) to Firebase Storage (with backup domain suffix fallback and 3s timeout).
 * Falls back to local server upload if Firebase Storage fails or hangs.
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
      finalFileType = fileBlob.type;
    }

    const timestamp = Date.now();
    const cleanName = finalFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `uploads/${timestamp}_${cleanName}`;

    // 1. Try Primary Firebase Storage (firebasestorage.app suffix)
    try {
      console.log(`Attempting upload to Primary Firebase Storage: ${defaultBucket}`);
      const downloadUrl = await uploadBytesWithTimeout(storage, storagePath, fileBlob, finalFileType, 3000);
      console.log("Uploaded successfully to Primary Firebase Storage:", downloadUrl);
      return downloadUrl;
    } catch (primaryError: any) {
      console.warn("Primary Firebase Storage upload failed or timed out:", primaryError.message || primaryError);

      // 2. Try Backup Firebase Storage (appspot.com suffix)
      try {
        console.log(`Attempting upload to Backup Firebase Storage: ${backupBucket}`);
        const downloadUrl = await uploadBytesWithTimeout(storageBackup, storagePath, fileBlob, finalFileType, 3000);
        console.log("Uploaded successfully to Backup Firebase Storage:", downloadUrl);
        return downloadUrl;
      } catch (backupError: any) {
        console.warn("Backup Firebase Storage upload also failed or timed out:", backupError.message || backupError);
        throw new Error("All Firebase Storage attempts failed or timed out");
      }
    }
  } catch (storageError: any) {
    console.warn("Firebase Storage upload completely failed. Falling back to local server raw binary upload...", storageError.message || storageError);
    
    // 3. Fallback to local raw binary upload (fast, but ephemeral on server restarts)
    try {
      const response = await fetch('/api/upload-raw', {
        method: 'POST',
        headers: {
          'x-file-name': encodeURIComponent(fileName),
          'content-type': fileOrBase64 instanceof File ? fileOrBase64.type : 'image/jpeg',
        },
        body: fileOrBase64 instanceof File 
          ? fileOrBase64 
          : await (async () => {
              const res = await fetch(fileOrBase64);
              return await res.blob();
            })(),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.url) {
          console.log("Uploaded successfully to local server raw:", result.url);
          return result.url;
        }
      }
      throw new Error(`Server raw upload status: ${response.status}`);
    } catch (rawError: any) {
      console.warn("Local raw binary upload also failed, falling back to base64 upload:", rawError);
      
      // 4. Fallback to base64 JSON /api/upload as final resort
      let base64Data: string;
      if (fileOrBase64 instanceof File) {
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file for fallback upload"));
          reader.readAsDataURL(fileOrBase64);
        });
      } else {
        base64Data = fileOrBase64;
      }

      const fallbackResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: fileName,
          fileType: fileOrBase64 instanceof File ? fileOrBase64.type : 'image/jpeg',
          fileData: base64Data,
        }),
      });

      if (!fallbackResponse.ok) {
        const errData = await fallbackResponse.json();
        throw new Error(errData.error || 'All upload methods failed');
      }

      const result = await fallbackResponse.json();
      if (result.success && result.url) {
        console.log("Uploaded successfully to local server fallback base64:", result.url);
        return result.url;
      } else {
        throw new Error('Invalid fallback base64 response');
      }
    }
  }
};

