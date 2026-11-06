import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);

// 浮层异步定位在负载较高的 Windows 环境可能超过默认 1 秒，保留所有行为断言。
configure({ asyncUtilTimeout: 5000 });
