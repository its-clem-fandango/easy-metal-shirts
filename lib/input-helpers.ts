let lastUploadTime = 0;
const UPLOAD_COOLDOWN = 30000; // Increased to 30 seconds cooldown
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds between retries

export async function generateCanvasFromInputText(
  text: string,
  fontStyle: string = "default"
): Promise<HTMLCanvasElement> {
  // Wait for fonts to load
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d", { alpha: true });

  canvas.width = 800;
  canvas.height = 400;

  // Clear to transparent background
  canvasContext!.clearRect(0, 0, canvas.width, canvas.height);

  const fontMap = {
    metalLord: {
      font: (size: number) => `${size}px MetalLord`,
      maxSize: 120,
      minSize: 20,
    },
    samdan: {
      font: (size: number) => `${size}px SamdanEvil`,
      maxSize: 120,
      minSize: 20,
    },
    suicidal: {
      font: (size: number) => `${size}px Suicidal`,
      maxSize: 100, // Smaller max size for Suicidal font
      minSize: 16,
    },
    slayer: {
      font: (size: number) => `${size}px Slayer`,
      maxSize: 100, // Reduced from 120 to match Suicidal
      minSize: 16,
    },
  };

  // Calculate font size that will fit
  const fontConfig =
    fontMap[fontStyle as keyof typeof fontMap] || fontMap.metalLord;
  let fontSize = fontConfig.maxSize; // Start with style-specific size
  const maxWidth = canvas.width * 0.9; // Leave some padding

  // Binary search to find the largest font size that fits
  let minSize = fontConfig.minSize;
  let maxSize = fontConfig.maxSize;

  while (minSize <= maxSize) {
    const mid = Math.floor((minSize + maxSize) / 2);
    canvasContext!.font = fontConfig.font(mid);
    const width = canvasContext!.measureText(text).width;

    if (width <= maxWidth) {
      fontSize = mid;
      minSize = mid + 1;
    } else {
      maxSize = mid - 1;
    }
  }

  // Apply the calculated font size
  canvasContext!.font = fontConfig.font(fontSize);
  canvasContext!.fillStyle = "white";
  canvasContext!.textAlign = "center";
  canvasContext!.textBaseline = "middle";

  // Add white text with stroke to ensure visibility
  const x = canvas.width / 2;
  const y = canvas.height / 2;

  // Add stroke to make text more visible
  canvasContext!.strokeStyle = "white";
  canvasContext!.lineWidth = 4;
  canvasContext!.strokeText(text, x, y);

  // Fill with white
  canvasContext!.fillText(text, x, y);

  return canvas;
}

export async function convertCanvasToBlob(
  text: string,
  fontStyle: string = "default"
): Promise<{ dataUrl: string; blob: Blob }> {
  const canvas = await generateCanvasFromInputText(text, fontStyle);

  const dataUrl = canvas.toDataURL(); //defaults to .png

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to create blob from canvas."));
      }
    }, "image/png");
  });

  // Debug: Log the blob type and size
  console.log("Generated image blob:", {
    type: blob.type,
    size: blob.size,
    dataUrl: dataUrl.substring(0, 100) + "...", // Show start of dataUrl
  });

  return { dataUrl, blob };
}

export async function uploadToImgur(blob: Blob): Promise<string> {
  // Check if we need to wait before uploading again
  const now = Date.now();
  const timeSinceLastUpload = now - lastUploadTime;

  if (timeSinceLastUpload < UPLOAD_COOLDOWN) {
    const waitTime = UPLOAD_COOLDOWN - timeSinceLastUpload;
    throw new Error(
      `Please wait ${Math.ceil(waitTime / 1000)} seconds before trying again`
    );
  }

  const formData = new FormData();
  formData.append("image", blob);

  let lastError: Error | null = null;

  // Try multiple times with delay between attempts
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        console.log(`Retry attempt ${attempt + 1}/${MAX_RETRIES}`);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.status === 429) {
        lastError = new Error(
          "Rate limit exceeded. Please wait a moment before trying again."
        );
        continue; // Try again after delay
      }

      const data = await response.json();
      console.log("Upload API response:", data);

      if (!response.ok) {
        lastError = new Error(
          `Upload failed: ${data.error || response.statusText}`
        );
        continue;
      }

      if (!data.success) {
        lastError = new Error(
          `Upload failed: ${data.data?.error || "Unknown error"}`
        );
        continue;
      }

      // Success! Update last upload time and return
      lastUploadTime = now;
      return data.data.link;
    } catch (error) {
      console.error(`Upload error (attempt ${attempt + 1}):`, error);
      lastError = error as Error;
    }
  }

  // If we get here, all attempts failed
  throw lastError || new Error("Failed to upload after multiple attempts");
}

/* 
Zazzle settings:
Create a product by going to the profile icon --> my stores --> products at the top nav bar --> create a new product

When creating a shirt, make sure you use an image as the template instead of text otherwise params.append with _iid wont work -- it would need to be text instead of iid

You can find the product ID right after you create a product by copying "its address on zazzle.com" and getting the last 18 digits
You need this id to create a product API but not sure I would ever need this actually
*/

export function generateZazzleProductUrl(imgurUrl: string): string {
  // Your Zazzle account details
  const associateId = "238052026395297176";
  const productId = "256363885288653934";

  // Base URL with required parameters
  const baseUrl = `https://www.zazzle.com/api/create/at-${associateId}`;

  // Encode the Imgur URL
  const encodedUrl = encodeURIComponent(imgurUrl);

  // Construct URL manually to ensure exact format
  const finalUrl = `${baseUrl}?rf=${associateId}&ax=Linkover&pd=${productId}&ed=true&tc=api_test&t_bandshirtblack_iid=${encodedUrl}`;

  console.log("Full Zazzle URL:", finalUrl);
  console.log("Original Image URL:", imgurUrl);
  console.log("Encoded Image URL:", encodedUrl);

  return finalUrl;
}
