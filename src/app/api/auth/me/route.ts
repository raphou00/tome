import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export const GET = async (_req: NextRequest) => {
    try {
        const user = await getUser();

        if (!user || !user.user) {
            return NextResponse.json({ authenticated: false });
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.user.id,
                name: user.user.name,
                email: user.user.email,
            },
        });
    } catch (_err) {
        return NextResponse.json({ authenticated: false });
    }
};
