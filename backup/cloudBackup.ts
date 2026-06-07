import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { setupDatabase } from '../db/database';

const DB_FILENAME = 'personal_manager.db';
const DB_PATH = `${FileSystem.documentDirectory}SQLite/${DB_FILENAME}`;

export async function exportBackup(): Promise<{ success: boolean; message: string }> {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return { success: false, message: 'Sharing is not available on this device.' };
    }

    // Check db file exists
    const info = await FileSystem.getInfoAsync(DB_PATH);
    if (!info.exists) {
      return { success: false, message: 'No data found to backup.' };
    }

    // Copy to cache with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const backupName = `health-backup-${timestamp}.db`;
    const backupPath = `${FileSystem.cacheDirectory}${backupName}`;
    await FileSystem.copyAsync({ from: DB_PATH, to: backupPath });

    // Open native share sheet — user picks Google Drive, iCloud, Files, etc.
    await Sharing.shareAsync(backupPath, {
      mimeType: 'application/octet-stream',
      dialogTitle: 'Save your health data backup',
      UTI: 'public.database',
    });

    return { success: true, message: 'Backup shared successfully!' };
  } catch (e: any) {
    return { success: false, message: e.message || 'Backup failed.' };
  }
}

export async function importBackup(): Promise<{ success: boolean; message: string }> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/octet-stream',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return { success: false, message: 'Import cancelled.' };
    }

    const file = result.assets[0];
    if (!file.uri) {
      return { success: false, message: 'Could not read the selected file.' };
    }

    // Ensure SQLite directory exists
    const sqliteDir = `${FileSystem.documentDirectory}SQLite/`;
    const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
    }

    // Overwrite the database with the backup
    await FileSystem.copyAsync({ from: file.uri, to: DB_PATH });

    // Re-initialize database tables (safe, uses CREATE IF NOT EXISTS)
    setupDatabase();

    return { success: true, message: 'Data restored successfully! Please restart the app.' };
  } catch (e: any) {
    return { success: false, message: e.message || 'Import failed.' };
  }
}

export async function getDbSize(): Promise<string> {
  try {
    const info = await FileSystem.getInfoAsync(DB_PATH);
    if (info.exists && 'size' in info) {
      const kb = Math.round(info.size / 1024);
      return kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(1)} MB`;
    }
    return '0 KB';
  } catch {
    return 'Unknown';
  }
}
