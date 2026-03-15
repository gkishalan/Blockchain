import { NextResponse } from "next/server";

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

        const PINATA_JWT = process.env.PINATA_JWT;
        const GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY;

        if (!PINATA_JWT || PINATA_JWT === "your_pinata_jwt_token_here") {
            return NextResponse.json(
                { error: "Pinata JWT is not configured. Please add your Pinata JWT to .env.local" },
                { status: 500 }
            );
        }

        // Build the FormData for Pinata V1 Pinning API
        const pinataFormData = new FormData();
        pinataFormData.append("file", file);

        // Optional: add metadata (file name)
        const pinataMetadata = JSON.stringify({
            name: file.name || "uploaded-file",
        });
        pinataFormData.append("pinataMetadata", pinataMetadata);

        // Upload & pin to IPFS via Pinata V1 Pinning API
        // This endpoint directly pins the file to IPFS, making it
        // accessible via any IPFS gateway including the dedicated one
        const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${PINATA_JWT}`,
            },
            body: pinataFormData,
        });

        if (!pinataRes.ok) {
            const errorText = await pinataRes.text();
            console.error("Pinata upload failed:", pinataRes.status, errorText);
            return NextResponse.json(
                { error: `Pinata upload failed: ${pinataRes.status}` },
                { status: 502 }
            );
        }

        const pinataData = await pinataRes.json();

        // V1 Pinning API returns: { IpfsHash: "Qm..." or "bafy...", PinSize, Timestamp }
        const ipfsHash = pinataData?.IpfsHash;

        if (!ipfsHash) {
            console.error("No IPFS hash returned from Pinata:", pinataData);
            return NextResponse.json(
                { error: "Failed to get IPFS hash from Pinata" },
                { status: 502 }
            );
        }

        // Build the public gateway URL
        // Format: https://<gateway>/ipfs/<IpfsHash>
        const gatewayDomain = GATEWAY || "gateway.pinata.cloud";
        const url = `https://${gatewayDomain}/ipfs/${ipfsHash}`;

        return NextResponse.json({ url, cid: ipfsHash });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
