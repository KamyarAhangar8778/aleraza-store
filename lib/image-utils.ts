/**
 * فشرده‌سازی و تغییر سایز کلاینت‌ساید تصاویر آپلودشده جهت ذخیره بهینه
 */
export function compressImageFile(
  file: File,
  onImageReady: (dataUrl: string) => void,
  maxDimension = 720,
  quality = 0.78
) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      if (w > h && w > maxDimension) {
        h = Math.round((h * maxDimension) / w);
        w = maxDimension;
      } else if (h > maxDimension) {
        w = Math.round((w * maxDimension) / h);
        h = maxDimension;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        onImageReady(dataUrl);
      }
    };
    img.src = ev.target?.result as string;
  };
  reader.readAsDataURL(file);
}
