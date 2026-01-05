import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
export const loader = async ({ request }) => {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        // Resolve the pathname of the incoming request and extract the relative path
        const url = new URL(request.url);
        const pathname = url.pathname;

        // The route is mounted at `/cards/*` so get the part after `/cards/`
        const routeSegment = "/cards/";
        let relPath = "";
        const idx = pathname.indexOf(routeSegment);
        if (idx !== -1) {
            relPath = pathname.substring(idx + routeSegment.length);
        } else {
            relPath = pathname.replace(/(^\/|\/$)/g, "");
        }

        // Normalize and prevent path traversal
        if (relPath.includes("..")) {
            return new Response("Forbidden", { status: 403 });
        }

        // If no specific file requested, serve index.html
        if (!relPath || relPath === "") {
            const htmlPath = path.join(__dirname, "index.html");
            const html = fs.readFileSync(htmlPath, "utf8");
            return new Response(html, {
                status: 200,
                headers: { "Content-Type": "text/html" },
            });
        }

        // Attempt to serve static file if it exists
        const filePath = path.join(__dirname, relPath);
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const contentTypes = {
                ".css": "text/css",
                ".js": "application/javascript",
                ".html": "text/html",
                ".json": "application/json",
                ".svg": "image/svg+xml",
                ".png": "image/png",
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".gif": "image/gif",
            };
            const contentType = contentTypes[ext] || "application/octet-stream";
            const file = fs.readFileSync(filePath);
            return new Response(file, {
                status: 200,
                headers: { "Content-Type": contentType },
            });
        }

        // Fallback: serve index.html for client-side routing
        const htmlPath = path.join(__dirname, "index.html");
        const html = fs.readFileSync(htmlPath, "utf8");
        return new Response(html, {
            status: 200,
            headers: { "Content-Type": "text/html" },
        });
    } catch (error) {
        console.error("Loader error:", error);
        const errorHtml = `
      <html><body>
      <p>Failed to load app.</p>
      </body></html>
    `;
        return new Response(errorHtml, { status: 500, headers: { "Content-Type": "text/html" } });
    }
};
