import { v4 as uuidv4 } from 'uuid';

// ローカルストレージからユーザーIDを取得
export function getUserIdFromLocalStorage(): string {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    // ユーザーIDがない場合は新しいUUIDを生成して設定
    return resetUserIdInLocalStorage();
  }
  return userId;
}

// ローカルストレージに保存されたユーザーIDを再設定
export function resetUserIdInLocalStorage(): string {
  const userId = uuidv4(); // 新しいUUIDを生成
  localStorage.setItem('userId', userId); // ローカルストレージに保存
  return userId;
}
