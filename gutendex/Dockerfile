FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    rsync \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install --no-cache-dir -r requirements.txt gunicorn

EXPOSE 8000

CMD ["gunicorn", "gutendex.wsgi:application", "--bind", "0.0.0.0:8000"]
