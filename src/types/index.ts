/**
 * Shared Type Definitions — Cocokin!
 * Kontrak tipe bersama antara Frontend (daliondroid) dan Backend (farrelzaki).
 * Mengikuti konvensi snake_case sesuai docs/ARSITEKTUR.md.
 * Tipe request/response API ada di ./api.ts (kontrak bagian 4 ARSITEKTUR).
 */

export type RumpunIlmu = 'saintek' | 'soshum';
export type JenjangProdi = 'S1' | 'D4' | 'D3';
export type LabelKeketatan = 'sangat_ketat' | 'ketat' | 'sedang' | 'longgar';

export * from './api';
