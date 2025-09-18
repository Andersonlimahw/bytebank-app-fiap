// Lightweight helper to access app metadata without Expo
// Note: Metro supports importing JSON; tsconfig sets resolveJsonModule
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import pkg from "../../package.json";
export const appVersion = pkg?.version ?? "1.0.0";
export const appName = pkg?.name ?? "bytebank";
