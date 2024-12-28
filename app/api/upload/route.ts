import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const clientId = process.env.IMGUR_CLIENT_ID;
    if (!clientId) {
      throw new Error("Imgur Client ID is not configured");
    }

    const imgurResponse = await fetch("https://api.imgur.com/3/upload", {
      method: "POST",
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: formData,
    });

    const data = await imgurResponse.json();

    if (!imgurResponse.ok) {
      return NextResponse.json(
        { error: data.data?.error || "Upload failed" },
        { status: imgurResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
