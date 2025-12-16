import swaggerAutogen from 'swagger-autogen';

const options = {
  openapi: '3.0.0',
  disableLogs: true,
  writeOutputFile: true, // ✅ 중요: 파일을 실제로 생성합니다.
};

// 생성될 파일 경로 (src 폴더 내부에 생성하여 import 하기 쉽게 함)
const outputFile = './src/swagger-output.json';

// 라우트 파일 경로들
const routes = [
  "./src/index.ts",
];

const doc = {
  info: {
    title: 'Interview Daily API',
    description: 'Interview Daily API 명세서입니다.',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

// 문서를 생성합니다.
swaggerAutogen(options)(outputFile, routes, doc);