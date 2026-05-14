import api from './axios';

/**
 * Upload an image file to a categorised endpoint.
 * Returns the public URL (e.g. /uploads/avatars/xxx.png).
 *
 * @param {File} file - the file to upload
 * @param {"avatar"|"quiz"|"product"|"brand"|"generic"} category
 * @param {(progress:number) => void} [onProgress]
 */
export async function uploadImage(file, category = 'generic', onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post(`/v1/uploads/${category}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onProgress && evt.total) {
        onProgress(Math.round((evt.loaded * 100) / evt.total));
      }
    },
  });

  return data?.data?.url || null;
}
