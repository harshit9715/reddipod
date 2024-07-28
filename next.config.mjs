/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: "*.convex.cloud"
        },
        {
            hostname: "*.clerk.com"
        }]
    }
};

export default nextConfig;
