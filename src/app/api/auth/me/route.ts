import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export const GET = async () => {
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
    } catch (err) {
        console.error(err);
        return NextResponse.json({ authenticated: false });
    }
};
