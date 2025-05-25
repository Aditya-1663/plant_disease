# Use Python base image
FROM python:3.10

# Set working directory
WORKDIR /app

# Copy all files to container
COPY . .

# Install dependencies
RUN pip install --upgrade pip \
 && pip install -r requirements.txt

# Expose port (must be 7860 for HF Spaces)
EXPOSE 7860

# Start the Flask app with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "run:app"]
