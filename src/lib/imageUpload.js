function getExtension(file) {
  const parts = file.name.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : 'jpg';
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function loadImage(file) {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file);
  }

  const imageUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = imageUrl;
    });
    return image;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export async function optimizeImage(file) {
  if (!file?.type?.startsWith('image/')) {
    return file;
  }

  if (typeof document === 'undefined') {
    return file;
  }

  try {
    const source = await loadImage(file);
    const maxWidth = 1600;
    const scale = Math.min(1, maxWidth / source.width);
    const width = Math.max(1, Math.round(source.width * scale));
    const height = Math.max(1, Math.round(source.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      return file;
    }

    context.drawImage(source, 0, 0, width, height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));

    if (!blob) {
      return file;
    }

    if (blob.size >= file.size) {
      return file;
    }

    if (typeof File === 'function') {
      return new File(
        [blob],
        `${slugify(file.name.replace(/\.[^.]+$/, '')) || 'project-image'}.webp`,
        {
          type: 'image/webp'
        }
      );
    }

    return blob;
  } catch {
    return file;
  }
}

export function buildStoragePath(slug, file) {
  const timestamp = Date.now();
  const extension = file.type === 'image/webp' ? 'webp' : getExtension(file);
  return `projects/${slugify(slug) || 'project'}/${timestamp}.${extension}`;
}
