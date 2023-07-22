import Resizer from 'react-image-file-resizer';

// Kullanıcıdan alınan resmi boyutlandırma ve Base64'e dönüştürme fonksiyonu
const ResizeImage = (file, maxWidth, maxHeight, toBase64 = true) => {
  return new Promise((resolve) => {
    if (toBase64) {
      Resizer.imageFileResizer(
        file,
        maxWidth,
        maxHeight,
        'JPEG', // Formatı belirleyebilirsiniz (JPEG, PNG, GIF, vb.)
        100, // Kalite (0-100 arasında)
        0, // Yeniden boyutlandırmadan önce döndürme açısı (0 = döndürme yok)
        (resizedImage) => {
          resolve(resizedImage);
        },
        'base64', // Sonuç olarak base64 formatında veri almak istediğimiz için 'base64' olarak belirliyoruz
        500, // Yeniden boyutlandırma işlemi sırasında önbelleğe alınan en büyük resim boyutu (piksel cinsinden)
        250 // Önbellekte tutulacak maksimum süre (ms cinsinden)
      );
    } else {
      Resizer.imageFileResizer(
        file,
        maxWidth,
        maxHeight,
        'JPEG', // Formatı belirleyebilirsiniz (JPEG, PNG, GIF, vb.)
        100, // Kalite (0-100 arasında)
        0, // Yeniden boyutlandırmadan önce döndürme açısı (0 = döndürme yok)
        (resizedImage) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(resizedImage);
        },
        'blob', // Sonuç olarak blob formatında veri almak istediğimiz için 'blob' olarak belirliyoruz
        500, // Yeniden boyutlandırma işlemi sırasında önbelleğe alınan en büyük resim boyutu (piksel cinsinden)
        250 // Önbellekte tutulacak maksimum süre (ms cinsinden)
      );
    }
  });
};

export default ResizeImage;
