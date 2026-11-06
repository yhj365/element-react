'use client';
import { createContext } from 'react';
import type { ComponentSize } from '../../hooks';
export const AvatarGroupContext = createContext<{
  size?: number | ComponentSize;
  shape?: 'circle' | 'square';
}>({});
