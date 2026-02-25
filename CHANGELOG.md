# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [2026-02-25] - Hero Section Responsive Layout Adjustments

### Fixed
- Fixed floating tech items and badges on the Hero section to be visible across all screen sizes (mobile, tablet, desktop).
- Modified the description paragraph to utilize the full available width on smaller screens, removing previous centering constraints.

## [2026-02-24] - Frontend Visibility Toggle Fix

### Fixed
- Fixed CMS Admin Panel toggle not reflecting in the frontend parts. Added a global hook `useAllSectionVisibilities` in `useHomepageContent.ts` and conditionally rendered all sections in `Index.tsx` to fix the visibility issue.

## [2026-02-06] - Codebase Cleanup

### Changed
- Moved `HOMEPAGE_CMS_SETUP.md`, `MIGRATION_GUIDE.md`, and `MIGRATION_RECOVERY.md` to `docs/` directory for better organization.
- Moved `seed_db.js` to `scripts/` directory.

### Removed
- Deleted `QUICK_FIX.md` as it was a temporary fix guide and is no longer needed.

### Fixed
- Improved project root directory structure.
