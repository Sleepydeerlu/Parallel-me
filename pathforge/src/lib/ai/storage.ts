import { DialogueContext } from "./context";
import { serializeContext, deserializeContext } from "./context-manager";

const STORAGE_KEY = "pathforge_context";
const STORAGE_VERSION = "1.0";

interface StoredData {
  version: string;
  context: string;
  lastSaved: string;
}

// 保存上下文到本地存储
export function saveContextToStorage(context: DialogueContext): void {
  try {
    const data: StoredData = {
      version: STORAGE_VERSION,
      context: serializeContext(context),
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save context to storage:", error);
  }
}

// 从本地存储加载上下文
export function loadContextFromStorage(): DialogueContext | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: StoredData = JSON.parse(stored);
    
    // 版本检查
    if (data.version !== STORAGE_VERSION) {
      console.warn("Storage version mismatch, clearing storage");
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return deserializeContext(data.context);
  } catch (error) {
    console.error("Failed to load context from storage:", error);
    return null;
  }
}

// 清除本地存储
export function clearContextStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear storage:", error);
  }
}

// 检查是否有存储的上下文
export function hasStoredContext(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

// 获取存储的上下文统计信息
export function getStorageStats(): { lastSaved: string; messageCount: number } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: StoredData = JSON.parse(stored);
    const context = deserializeContext(data.context);

    return {
      lastSaved: data.lastSaved,
      messageCount: context.metadata.messageCount,
    };
  } catch {
    return null;
  }
}
