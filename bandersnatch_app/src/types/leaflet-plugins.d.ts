// Ambient declaration so TypeScript accepts `import("leaflet-polylineoffset")`
// The plugin patches L.Polyline at runtime and has no meaningful exports.
declare module "leaflet-polylineoffset";
