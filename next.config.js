module.exports = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/api",
      },
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
