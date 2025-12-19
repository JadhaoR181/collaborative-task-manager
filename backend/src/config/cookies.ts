export const authCookieOptions = {
  httpOnly: true,
  secure: true,        // REQUIRED on HTTPS (Render)
  sameSite: "none" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000
};
