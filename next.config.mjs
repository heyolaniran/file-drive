/** @type {import('next').NextConfig} */
const nextConfig = {

    images : {
        remotePatterns : [
            {
                protocol : 'https', 
                hostname : 'zany-wildebeest-667.convex.cloud', 
                
            }
        ]
    }
};

export default nextConfig;
