import logging, time
from fastapi import Request
from collections import defaultdict

logging.basicConfig(level=logging.INFO)

user_requests = defaultdict(list)

async def log_and_rate_limit(request: Request, call_next):
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "unknown")
    now = time.time()

    # Rate limiting → 5 requests per IP per 1 hour
    window = 60 * 60
    limit = 5
    requests = [t for t in user_requests[client_ip] if now - t < window]
    user_requests[client_ip] = requests

    if len(requests) >= limit:
        logging.warning(f"Rate limit exceeded by {client_ip}")
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Please try again later."},
        )

    # Add current request timestamp
    user_requests[client_ip].append(now)

    # Log request
    logging.info(f"Request from {client_ip} | {user_agent} | {request.url.path}")

    response = await call_next(request)
    return response
