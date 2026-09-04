export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({ Error: "Method not allowed" });
    }

    const title = typeof req.query.title === "string" ? req.query.title.trim() : "";

    if (!title) {
        return res.status(400).json({ Error: "Movie title is required" });
    }

    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ Error: "OMDb API key is not configured" });
    }

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${encodeURIComponent(apiKey)}&t=${encodeURIComponent(title)}`
        );

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ Error: "Unable to connect to the movie service." });
    }
}
