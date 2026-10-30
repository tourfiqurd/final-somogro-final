# Project memory

## Product intent & audience

- Bengali-language education management platform ("সমগ্র" / Samagra)
- Users: super admins, principals (অধ্যক্ষ), educators, students, parents
- Roles displayed in Bengali (সুপার অ্যাডমিন, অধ্যক্ষ, etc.)
- Academic year selection (শিক্ষাবর্ষ ২০২৬)
- Institution: সিলেট মডেল উচ্চ বিদ্যালয়
- Sample user: মোহাম্মদ রফিকুল ইসলাম (principal@samagra.demo)
- Audience: educational institutions in Bengali-speaking regions

## Brand personality & voice

- Bengali-first UI (labels, navigation, role names in Bengali)
- Professional, administrative tone for education management

## Visual design & UX direction

- **Top navbar (all dashboards):** সমগ্র logo + role badge, institution name + EIIN, শিক্ষাবর্ষ academic year selector, ওয়েবসাইট হোমপেজ link, user profile (name, email) with logout button
- **Sidebar:** Full-height top-to-bottom, navigation menu + collapse toggle only; profile/academic-year/homepage moved to navbar
- Tailwind CSS + React JSX; icons from lucide-react
- React Router `Link` for internal navigation (avoid full-page reloads)
- Consistent navbar + sidebar layout across all 5 dashboards (admin, principal, teacher, student, parent)

## Decisions, constraints & rationale

- Navbar added to top of all dashboards to consolidate profile, institution, academic year, homepage link
- Sidebar simplified to nav-only and made full-height per explicit user request
- Applied uniformly to all dashboards for consistency
- Profile card moved from sidebar to navbar; academic year selector and homepage link also relocated
- Tech: Vite + React, `@/` path alias → `src/`
- No UI packages beyond template defaults (Tailwind, lucide-react)

## Open questions & assumptions

- Assumption: React Router confirmed via Link usage
- Sidebar collapse behavior on mobile not yet specified
- Navbar responsive behavior on small screens not yet specified
- No explicit color/typography system documented — infer from existing components
- Bengali font stack and loading strategy not yet verified