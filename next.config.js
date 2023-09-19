const dotenv = require("dotenv");
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URLPOST,
    SECRET_KEY: "eefeijfksvdvdsvdsdsvsdvdvdfgbfgbgfbfgbfgbkjhfuhudhfudd=",
  },
  experimental: {
    appDir: true,
  },
  compiler: {
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
      "utfs.io",
    ],
  },
};

module.exports = nextConfig;
