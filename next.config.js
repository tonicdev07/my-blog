const dotenv = require("dotenv");
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  variants: {
    extend: {
      maxHeight: ["focus"],
      backgroundColor: ['active'],
    },
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    domains: [
      "fakestoreapi.com",
      "encrypted-tbn0.gstatic.com",
      "www.google.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "platform-lookaside.fbsbx.com",
    ],
  },
};

module.exports = nextConfig;
