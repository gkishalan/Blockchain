import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { cid } = await request.json();

        if (!cid) {
            return NextResponse.json(
                { error: "No CID provided" },
                { status: 400 }
            );
        }

        const PINATA_JWT = process.env.PINATA_JWT;

        if (!PINATA_JWT) {
            return NextResponse.json(
                { error: "Pinata JWT is not configured" },
                { status: 500 }
            );
        }

        // Unpin (delete) the file from Pinata IPFS
        const pinataRes = await fetch(
            `https://api.pinata.cloud/pinning/unpin/${cid}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${PINATA_JWT}`,
                },
            }
        );

        if (!pinataRes.ok) {
            const errorText = await pinataRes.text();
            console.error("Pinata unpin failed:", pinataRes.status, errorText);
            // Don't fail the whole operation — the on-chain delete still succeeded
            return NextResponse.json(
                { success: false, warning: "File unpin failed but message was deleted" },
                { status: 200 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Unpin error:", error);
        return NextResponse.json(
            { error: "Unpin failed" },
            { status: 500 }
        );
    }
}
