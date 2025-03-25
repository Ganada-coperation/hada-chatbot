# base image
FROM node:18-alpine

# workdir 설정
WORKDIR /app

# package 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 복사
COPY . .

# 빌드
RUN npm run build

# worker 실행
CMD ["node", "dist/main.worker.js"]
