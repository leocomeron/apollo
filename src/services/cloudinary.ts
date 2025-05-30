export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
    );

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error('Error uploading to Cloudinary');
    }

    const data = await response.json();
    // Add optimization parameters to the URL
    const optimizedUrl = data.secure_url.replace(
      '/upload/',
      '/upload/f_auto,q_auto/',
    );
    return optimizedUrl;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};
