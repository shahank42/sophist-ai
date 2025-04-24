import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/geo")({
  GET: ({ request, params }) => {
    const ip = request.headers.get("X-Forwarded-For")?.split(", ");
    return json({ ip });
  },
});
