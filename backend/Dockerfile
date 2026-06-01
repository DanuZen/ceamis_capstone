# Gunakan Node.js 22 (native WebSocket support — dibutuhkan oleh Supabase)
FROM node:22-alpine

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json terlebih dahulu (untuk caching)
COPY package*.json ./

# Install dependencies (gunakan ci untuk memastikan instalasi bersih sesuai package-lock)
RUN npm ci

# Copy seluruh source code
COPY . .

# Build aplikasi NestJS (hasilnya akan masuk ke folder /dist)
RUN npm run build

# Hugging Face Spaces Docker (secara default) mengharuskan aplikasi berjalan di port 7860
EXPOSE 7860
ENV PORT=7860

# Command untuk menjalankan aplikasi di mode production
CMD ["npm", "run", "start:prod"]
