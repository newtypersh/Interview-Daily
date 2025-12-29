import { useRef, useEffect } from 'react';

export function useRenderCount(componentName: string) {
  const count = useRef(1);

  useEffect(() => {
    count.current++; // 렌더링 후 증가 (다음 렌더링 시 반영)
  });

  console.log(`[${componentName}] Render count: ${count.current}`);
  return count.current;
}
