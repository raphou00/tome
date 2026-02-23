import { type NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import db from "@/lib/db";

export const DELETE = async (_req: NextRequest) => {
    try {
        const user = await getUser();

        if (!user || !user.user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        await db.cart.deleteMany({
            where: {
                userId: user.user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
};
