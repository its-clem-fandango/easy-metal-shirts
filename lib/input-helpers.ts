export async function generateCanvasFromInputText(
  text: string
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d");

  canvas.width = 800;
  canvas.height = 400;

  //BG color
  canvasContext!.fillStyle = "black";
  canvasContext!.fillRect(0, 0, canvas.width, canvas.height);

  // Font  & Text Properties
  canvasContext!.font = "bold 60px Arial"; // default font
  canvasContext!.fillStyle = "white";
  canvasContext!.textAlign = "center";
  canvasContext!.textBaseline = "middle";

  // Filltext:
  canvasContext!.fillText(text, canvas.width / 2, canvas.height / 2);

  return canvas;
}

export async function convertCanvasToBlob(
  text: string
): Promise<{ dataUrl: string; blob: Blob }> {
  const canvas = await generateCanvasFromInputText(text);

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
  return { dataUrl, blob };
}

export async function uploadToFileIO(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", blob);

  const response = await fetch("https://file.io", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error("File.io upload failed");
  }

  return data.link;
}
