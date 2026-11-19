import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  experimental: { cpus: 1 },
};

export default function config(phase: string): NextConfig {
  return {
    ...nextConfig,
    // Building for production must not overwrite a running preview's artifacts.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-local" : ".next",
  };
}
