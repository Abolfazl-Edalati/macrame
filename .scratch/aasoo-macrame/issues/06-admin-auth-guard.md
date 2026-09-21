# 06: Admin auth and guard

**What to build:** the single-password gate on `/admin`, and the fix for the authorization gap that currently sits under it. The middleware already redirects unauthenticated admin page routes to the login page; that does not make the server actions safe, because the actions that create, update and delete Products and move Order status run without ever re-checking the session. This ticket makes login work at the route boundary and closes the gap: every mutating admin action verifies the admin session before it touches the database.

**Blocked by:** 01 (Test harness and driver regression) — the guard is asserted by driving the login flow over HTTP.

**Status:** ready-for-agent

- [ ] The login page accepts the configured password and grants access to `/admin`.
- [ ] A wrong password is rejected and grants nothing.
- [ ] An unauthenticated request to any `/admin` page redirects to the login page.
- [ ] Logging out ends access; a later request to `/admin` redirects again.
- [ ] The session cookie is httpOnly and same-site, and expires after 30 days.
- [ ] Every mutating admin action — create, update, delete Product, move Order status — refuses to run without a valid admin session.
- [ ] Route-boundary tests drive login over HTTP and assert the guarded routes and the action guard.
