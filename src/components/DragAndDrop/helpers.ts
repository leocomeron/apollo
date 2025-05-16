interface FileHandlerResult {
  imageData: string | null;
  error: string | null;
}

export const handleImageFile = (file: File): Promise<FileHandlerResult> => {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({ imageData: null, error: 'El archivo debe ser una imagen' });
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const imageData = reader.result as string;
        if (
          typeof imageData === 'string' &&
          imageData.startsWith('data:image/')
        ) {
          resolve({ imageData, error: null });
        } else {
          resolve({ imageData: null, error: 'Formato de imagen no válido' });
        }
      } catch (err) {
        console.error('Error processing image:', err);
        resolve({ imageData: null, error: 'Error al procesar la imagen' });
      }
    };

    reader.onerror = () => {
      console.error('FileReader error:', reader.error);
      resolve({ imageData: null, error: 'Error al leer el archivo' });
    };

    try {
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
      resolve({ imageData: null, error: 'Error al leer el archivo' });
    }
  });
};

export const ACCEPTED_IMAGE_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};
