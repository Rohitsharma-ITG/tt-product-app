import { authenticate, unauthenticated } from "../../shopify.server.js"
import { ErrorMessage, statusCode } from "../constant/messages.js"
import prisma from "../../db.server.js";

export const authenticateUser = async (req) => {
    try {
        const url = new URL(req.url);
        const queryShop = url.searchParams.get("shop");

        const { session, admin } = queryShop
            ? await unauthenticated.admin(queryShop)
            : await authenticate.admin(req);

        if (!session?.shop) {
            return { status: false, message: `Shop ${ErrorMessage.NOT_FOUND}`, httpCode: statusCode.NOT_FOUND };
        }

        const shop = session.shop;
        const storeSessions = await prisma.session.findFirst({
            where: { shop },
        });

        if (!storeSessions || shop !== storeSessions.shop) {
            return { status: false, message: ErrorMessage.UNAUTHORIZED, httpCode: statusCode.UNAUTHORIZED };
        }

        req.shop_name = shop;
        req.session = session;
        req.admin = admin;
        return { status: true };
    } catch (error) {
        console.error(`Catch Error in authenticateUser:`, error);
        return { status: false, message: `Shop ${ErrorMessage.NOT_FOUND}`, httpCode: statusCode.NOT_FOUND };
    }
};