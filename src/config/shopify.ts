import { ApiVersion, Session, ShopifyRestResources, shopifyApi } from "@shopify/shopify-api";

// export let session: Session

// export const shopify = shopifyApi({
//     apiKey: process.env.SHOPIFY_API_KEY,
//     apiSecretKey: process.env.SHOPIFY_SECRET_KEY,
//     apiVersion: ApiVersion.July22,
//     hostName: 'localhost:4321',
//     isEmbeddedApp: true,
//     scopes: ["orders", "marketplace_orders"],
//     logger: {
//         httpRequests: true,
//         timestamps: true
//     }
// });

export const shopify = shopifyApi({
    apiKey: "2227506ec9517f7b8cd8c778ffa30541",
    // process.env.SHOPIFY_API_KEY,
    apiSecretKey: "7e1b6634aa0eb7d620ea280b13c121fb",
    // process.env.SHOPIFY_SECRET_KEY,
    apiVersion: ApiVersion.July22,
    hostName: 'localhost:8080',
    isEmbeddedApp: true,
    scopes: ["read_products"/* "orders", "marketplace_orders" */],
    logger: {
        httpRequests: true,
        timestamps: true
    }
});

// const OAuth = shopify.auth.begin({
//     shop: shopify.utils.sanitizeShop(req.query.shop, true),
//     callbackPath: '/auth/callback',
//     isOnline: false,
//     rawRequest: req,
//     rawResponse: res
// })

// const Client = new shopify.clients.Rest({session})