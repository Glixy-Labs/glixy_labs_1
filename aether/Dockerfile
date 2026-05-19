# =====================================================
#  Glixy Aether — container image
#  Build:  docker build -t glixylabs/aether .
#  Run:    docker run -p 7777:7777 -v $HOME/.aether:/data glixylabs/aether
# =====================================================
FROM python:3.12-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    AETHER_DATA_DIR=/data \
    AETHER_HOST=0.0.0.0 \
    AETHER_PORT=7777

WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

RUN useradd -m -u 10001 aether \
 && mkdir -p /data \
 && chown -R aether:aether /app /data
USER aether

VOLUME ["/data"]
EXPOSE 7777

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:7777/api/health || exit 1

ENTRYPOINT ["python", "-m", "aether.cli"]
CMD ["start"]
