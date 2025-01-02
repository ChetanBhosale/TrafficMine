import axios from "axios";
const cheerio = require("cheerio");

export async function checkWebsiteExists(url) {
    try {
        const response = await axios.get(url, { timeout: 5000 });
        return response.status >= 200 && response.status < 400;
    } catch (error) {
        console.error(`Website check failed: ${error.message}`);
        return false;
    }
}

export async function getFavicon(url) {
    try {
        const websiteExists = await checkWebsiteExists(url);
        if (!websiteExists) {
            console.error("Website does not exist or is unreachable.");
            return null;
        }

        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        let favicon =
            $('link[rel="icon"]').attr("href") ||
            $('link[rel="shortcut icon"]').attr("href");

        if (favicon) {
            if (!favicon.startsWith("http") && !favicon.startsWith("//")) {
                const baseUrl = new URL(url).origin;
                favicon = `${baseUrl}${favicon.startsWith("/") ? "" : "/"}${favicon}`;
            } else if (favicon.startsWith("//")) {
                favicon = `https:${favicon}`;
            }
        } else {
            favicon = `${new URL(url).origin}/favicon.ico`;
        }

        return favicon;
    } catch (error) {
        console.error("Error fetching favicon:", error.message);
        return null;
    }
}
