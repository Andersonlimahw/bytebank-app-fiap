// Map static assets per brand/mode. If an entry is missing, the UI will
// gracefully fall back to rendering `theme.logoText` instead of an image.
export const brandLogos = {
    bytebank: {
        light: require("../../../public/assets/images/icons/Logo.png"),
        // dark: provide a dark variant if available
    },
    heliobank: {
    // No custom image provided; falls back to text logo
    },
};
