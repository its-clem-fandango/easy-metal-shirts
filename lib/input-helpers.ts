export async function generateCanvasFromInputText(
  text: string,
  fontStyle: string = "default"
): Promise<HTMLCanvasElement> {
  await document.fonts.ready;

  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d", {
    alpha: true,
    willReadFrequently: true,
  });

  if (!canvasContext) {
    throw new Error("Failed to get canvas context");
  }

  canvas.width = 800;
  canvas.height = 400;

  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

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
      maxSize: 100,
      minSize: 16,
    },
    slayer: {
      font: (size: number) => `${size}px Slayer`,
      maxSize: 100,
      minSize: 16,
    },
  };

  const fontConfig =
    fontMap[fontStyle as keyof typeof fontMap] || fontMap.metalLord;
  let fontSize = fontConfig.maxSize;
  const maxWidth = canvas.width * 0.9;

  let minSize = fontConfig.minSize;
  let maxSize = fontConfig.maxSize;

  while (minSize <= maxSize) {
    const mid = Math.floor((minSize + maxSize) / 2);
    canvasContext.font = fontConfig.font(mid);
    const width = canvasContext.measureText(text).width;

    if (width <= maxWidth) {
      fontSize = mid;
      minSize = mid + 1;
    } else {
      maxSize = mid - 1;
    }
  }

  canvasContext.font = fontConfig.font(fontSize);
  canvasContext.fillStyle = "white";
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";

  const x = canvas.width / 2;
  const y = canvas.height / 2;

  canvasContext.strokeStyle = "white";
  canvasContext.lineWidth = 4;
  canvasContext.strokeText(text, x, y);
  canvasContext.fillText(text, x, y);

  const freshCanvas = document.createElement("canvas");
  freshCanvas.width = canvas.width;
  freshCanvas.height = canvas.height;
  const freshContext = freshCanvas.getContext("2d");
  if (freshContext) {
    freshContext.drawImage(canvas, 0, 0);
  }

  return freshCanvas;
}

export async function convertCanvasToBlob(
  text: string,
  fontStyle: string = "default"
): Promise<{ dataUrl: string; blob: Blob }> {
  const canvas = await generateCanvasFromInputText(text, fontStyle);
  const dataUrl = canvas.toDataURL("image/png", 1.0);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob from canvas."));
        }
      },
      "image/png",
      1.0
    );
  });

  return { dataUrl, blob };
}

export async function uploadToImgur(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("image", blob);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Upload failed: ${data.error || response.statusText}`);
    }

    if (!data.success) {
      throw new Error(`Upload failed: ${data.data?.error || "Unknown error"}`);
    }

    return data.data.link;
  } catch (error) {
    throw error;
  }
}

/* 
Zazzle settings:
Create a product by going to the profile icon --> my stores --> products at the top nav bar --> create a new product

When creating a shirt, make sure you use an image as the template instead of text otherwise params.append with _iid wont work -- it would need to be text instead of iid

You can find the product ID right after you create a product by copying "its address on zazzle.com" and getting the last 18 digits
You need this id to create a product API but not sure I would ever need this actually
*/

export function generateZazzleProductUrl(imgurUrl: string): string {
  const associateId = "238052026395297176";
  const productId = "256363885288653934";

  const baseUrl = `https://www.zazzle.com/api/create/at-${associateId}`;

  const params = new URLSearchParams();
  params.append("rf", associateId);
  params.append("ax", "Linkover");
  params.append("pd", productId);
  params.append("ed", "true");
  params.append("tc", "api_test");
  params.append("t_bandshirtblack_iid", imgurUrl);

  return `${baseUrl}?${params.toString()}`;
}
