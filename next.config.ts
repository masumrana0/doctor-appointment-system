import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Workaround for a dev-only Windows manifest issue:
    // "segment-explorer-node.js#SegmentViewNode" missing in React Client Manifest.
    devtoolSegmentExplorer: false,
  },
};

export default nextConfig;
