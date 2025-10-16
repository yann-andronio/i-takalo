import { useCallback } from 'react';

export const useProductLayout = () => {
  const getRowType = useCallback((index: number): 'full' | 'double' => {
    const cycleSize = 8;
    const positionInCycle = index % cycleSize;
    return positionInCycle < 6 ? 'double' : 'full';
  }, []);

  const getMarginTop = useCallback((index: number) => {
    if (index === 0) return 0;
    
    const currentType = getRowType(index);
    const previousType = getRowType(index - 1);
    
    if (currentType === 'full' && previousType === 'full') return 40;
    if (currentType === 'full' && previousType === 'double') return 50;
    if (currentType === 'double' && previousType === 'full') return 50;
    return 5;
  }, [getRowType]);

  const shouldShowPourVous = useCallback((index: number) => {
    if (index === 0) return false;
    const currentType = getRowType(index);
    const previousType = getRowType(index - 1);
    return currentType === 'double' && previousType === 'full';
  }, [getRowType]);

  return {
    getRowType,
    getMarginTop,
    shouldShowPourVous,
  };
};
