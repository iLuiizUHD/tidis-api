module.exports = {
  async rewrites() {
    return [
      {
        source: "/:path",
        destination: "/api/router/:path",
      },
      {
        source: "/v1/:path*",
        destination: "/api/v1/:path*",
      },
    ];
  },
};
