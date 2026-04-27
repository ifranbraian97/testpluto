'use server';

export async function uploadImageToR2(formData: FormData) {
  try {
    const response = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || 'Error al subir imagen',
      };
    }

    const data = await response.json();
    return {
      success: true,
      url: data.url,
      key: data.key,
    };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error.message || 'Error al subir imagen',
    };
  }
}
