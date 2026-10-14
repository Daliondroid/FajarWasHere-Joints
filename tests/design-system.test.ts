import { describe, it, expect } from 'vitest';
import type { RumpunIlmu, LabelKeketatan } from '@/types';

describe('Design System & Types Baseline', () => {
  it('harus memvalidasi tipe rumpun ilmu', () => {
    const saintek: RumpunIlmu = 'saintek';
    const soshum: RumpunIlmu = 'soshum';
    expect(saintek).toBe('saintek');
    expect(soshum).toBe('soshum');
  });

  it('harus memvalidasi status keketatan resmi', () => {
    const keketatanList: LabelKeketatan[] = ['sangat_ketat', 'ketat', 'sedang', 'longgar'];
    expect(keketatanList).toHaveLength(4);
    expect(keketatanList).toContain('sangat_ketat');
  });
});
