/**
 * Service để quản lý lưu trữ dữ liệu (localStorage)
 * Bao gồm các hàm để lưu và tải ảnh dưới dạng base64
 */

const STORAGE_KEYS = {
  TEACHER_IMAGE: 'teacher_image_base64',
};

/**
 * Chuyển đổi ảnh từ URL thành base64 và lưu vào localStorage
 * @param imageUrl - URL hoặc đường dẫn của ảnh
 * @param storageKey - Khóa để lưu trong localStorage (mặc định: TEACHER_IMAGE)
 */
export async function saveImageToLocalStorage(
  imageUrl: string,
  storageKey: string = STORAGE_KEYS.TEACHER_IMAGE
): Promise<void> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = () => {
        const base64String = reader.result as string;
        localStorage.setItem(storageKey, base64String);
        console.log(`✓ Đã lưu ảnh vào localStorage với key: ${storageKey}`);
        resolve();
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Lỗi khi lưu ảnh vào localStorage:', error);
    throw error;
  }
}

/**
 * Lấy ảnh base64 từ localStorage
 * @param storageKey - Khóa để lấy từ localStorage (mặc định: TEACHER_IMAGE)
 * @returns Chuỗi base64 của ảnh hoặc null nếu không tìm thấy
 */
export function getImageFromLocalStorage(
  storageKey: string = STORAGE_KEYS.TEACHER_IMAGE
): string | null {
  try {
    const base64String = localStorage.getItem(storageKey);
    if (base64String) {
      console.log(`✓ Đã lấy ảnh từ localStorage với key: ${storageKey}`);
    } else {
      console.warn(`⚠ Không tìm thấy ảnh với key: ${storageKey}`);
    }
    return base64String;
  } catch (error) {
    console.error('Lỗi khi lấy ảnh từ localStorage:', error);
    return null;
  }
}

/**
 * Xóa ảnh khỏi localStorage
 * @param storageKey - Khóa để xóa từ localStorage (mặc định: TEACHER_IMAGE)
 */
export function removeImageFromLocalStorage(
  storageKey: string = STORAGE_KEYS.TEACHER_IMAGE
): void {
  try {
    localStorage.removeItem(storageKey);
    console.log(`✓ Đã xóa ảnh khỏi localStorage với key: ${storageKey}`);
  } catch (error) {
    console.error('Lỗi khi xóa ảnh từ localStorage:', error);
  }
}

/**
 * Kiểm tra xem ảnh có tồn tại trong localStorage không
 * @param storageKey - Khóa để kiểm tra (mặc định: TEACHER_IMAGE)
 */
export function hasImageInLocalStorage(
  storageKey: string = STORAGE_KEYS.TEACHER_IMAGE
): boolean {
  return localStorage.getItem(storageKey) !== null;
}

export default {
  STORAGE_KEYS,
  saveImageToLocalStorage,
  getImageFromLocalStorage,
  removeImageFromLocalStorage,
  hasImageInLocalStorage,
};
