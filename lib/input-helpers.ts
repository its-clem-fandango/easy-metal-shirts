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
    default: (size: number) => `bold ${size}px Arial`,
    samdan: (size: number) => `${size}px SamdanEvil`,
    metalLord: (size: number) => `${size}px MetalLord`,
    suicidal: (size: number) => `${size}px Suicidal`,
    slayer: (size: number) => `${size}px Slayer`,
  };

  // Calculate font size that will fit
  let fontSize = 120; // Start with original size
  const maxWidth = canvas.width * 0.9; // Leave some padding
  const fontGetter =
    fontMap[fontStyle as keyof typeof fontMap] || fontMap.default;

  // Binary search to find the largest font size that fits
  let minSize = 20;
  let maxSize = 120;

  while (minSize <= maxSize) {
    const mid = Math.floor((minSize + maxSize) / 2);
    canvasContext!.font = fontGetter(mid);
    const width = canvasContext!.measureText(text).width;

    if (width <= maxWidth) {
      fontSize = mid;
      minSize = mid + 1;
    } else {
      maxSize = mid - 1;
    }
  }

  // Apply the calculated font size
  canvasContext!.font = fontGetter(fontSize);
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
  const formData = new FormData();
  formData.append("image", blob);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  console.log("Upload API response:", data);

  if (!response.ok) {
    throw new Error(`Upload failed: ${data.error || response.statusText}`);
  }

  if (!data.success) {
    throw new Error(`Upload failed: ${data.data?.error || "Unknown error"}`);
  }

  return data.data.link;
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
  // fit 256430318646648746

  //fill 256363885288653934

  // Base URL with required parameters
  const baseUrl = `https://www.zazzle.com/api/create/at-${associateId}`;

  // Create URL with parameters in the exact order from documentation
  const params = new URLSearchParams();
  params.append("rf", associateId);
  params.append("ax", "Linkover");
  params.append("pd", productId);
  params.append("ed", "true");
  params.append("tc", "api_test");
  params.append("t_bandshirtblack_iid", imgurUrl);

  // Log each parameter
  console.log("Zazzle URL Parameters:");
  params.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });

  const finalUrl = `${baseUrl}?${params.toString()}`;
  console.log("Full Zazzle URL:", finalUrl);

  return finalUrl;
}
