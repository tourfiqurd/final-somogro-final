# Project memory

## Product intent & audience

- Bengali-language education management platform ("সমগ্র" / Samagra)
- Users: super admins, educators, and students (roles displayed in Bengali: সুপার অ্যাডমিন)
- Includes academic year selection (শিক্ষাবর্ষ ২০২৬)
- Features login/registration flows, dashboard with sidebar navigation
- Audience likely educational institutions in Bengali-speaking regions

## Brand personality & voice

- Bengali-first UI (labels, navigation, role names in Bengali)
- Professional, administrative tone suited for education management

## Visual design & UX direction

- Left sidebar layout: profile/logout card at top (compact), collapse toggle, academic year selector, then nav menu
- Sidebar should feel smooth and compact — user requested smaller profile card for better nav flow
- Tailwind CSS for styling with React + JSX
- Icons from lucide-react
- Avoid full-page reloads — use React Router `Link` instead of `<a href>` for internal navigation
- Responsive admin dashboard pattern

## Decisions, constraints & rationale

- Profile card moved to sidebar top (was elsewhere) to streamline navigation; kept smaller for compactness
- Academic year selector preserved in sidebar per explicit user requirement
- Login/register page navigation converted from `<a>` to React Router `Link` to prevent full-page reloads
- Back-to-home links on login/register also converted to `Link`
- Tech: Vite + React, `@/` path alias maps to `src/`
- No additional UI packages beyond template defaults (Tailwind, lucide-react)

## Open questions & assumptions

- Assumption: React Router is the routing library in use (confirmed by Link conversion)
- Sidebar collapse behavior on mobile not yet specified
- No explicit color/typography system documented yet — infer from existing components
- Bengali font stack and loading strategy not yet verified