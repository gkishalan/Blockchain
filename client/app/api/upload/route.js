import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Read the file into a Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Build a unique filename: timestamp + random hex + original extension
        const ext = path.extname(file.name || "file") || ".bin";
        const uniqueName = `${Date.now()}_${randomBytes(6).toString("hex")}${ext}`;

        // Ensure the uploads directory exists inside public/
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        // Write the file
        const filePath = path.join(uploadsDir, uniqueName);
        await writeFile(filePath, buffer);

        // Return the public URL (Next.js serves public/ at the root)
        const url = `/uploads/${uniqueName}`;
        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
