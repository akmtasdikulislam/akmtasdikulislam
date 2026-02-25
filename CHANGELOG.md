# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [2026-02-25] - Hero Section Responsive Layout Adjustments

### Fixed
- Fixed floating tech items and badges on the Hero section to be visible across all screen sizes (mobile, tablet, desktop).
- Modified the description paragraph to utilize the full available width on smaller screens, removing previous centering constraints.
- Centered the social media links block on mobile screens for improved aesthetics.
- Added vertical spacing (y-axis padding) around the profile photo container on mobile to prevent floating items from clipping or overlapping text.
- Fixed a layout regression where rotating decorative circles around the profile photo became elliptical on smaller screens due to vertical padding.
- Prevented timeline date badges from stretching to full width on mobile screens by enforcing fitting widths and `items-start` flex alignments.

### Added
- Replicated the animated bottom gradient bar styling and hover gradients from the Services section items onto the items within the "Why Choose Me" section.
- Equalized structural dimensions within "Why Choose Me" item blocks to flawlessly match "Services" blocks, resolving an uneven alignment issue on the animated bottom borders.

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
