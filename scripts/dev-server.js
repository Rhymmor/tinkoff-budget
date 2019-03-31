const ParcelProxyServer = require("parcel-proxy-server");

const server = new ParcelProxyServer({
    entryPoint: "src/client/index.html",
    parcelOptions: {
        outDir: "dev-dist"
    },
    proxies: {
        // add proxies here
        "/api": {
            target: "http://localhost:3000"
        }
    }
});

server.listen(8080, () => {
    console.log("Parcel proxy server has started");
});
