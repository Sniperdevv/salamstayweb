# Research input 1 — Generic Airbnb/Booking-class screen universe (online research)

> Source: online-research scout (Airbnb/Booking teardowns, Revyl Atlas, PageFlows, Houst, Banani).
> ~301 raw entries. SCOPE NOTE FOR WORKERS: SalamStay registry = guest+host app+web ONLY. The
> "shared/system" entries here are NOT separate registry rows — fold them into each screen's states
> (empty/loading/error/offline) per the Design Loop definition-of-done. Ignore admin-ish entries.
> Format: Name — purpose — persona — platform — MVP/later.

## G1. Guest: onboarding & auth
Splash/launch — brand load — guest — app — MVP
Welcome/value-prop — intro carousel — guest — app — MVP
Permissions primers — location/notifications/camera rationale — guest — app — MVP
Sign up (phone/email entry) — guest — app+web — MVP
OTP verify (SMS/email) — guest — app+web — MVP
Social auth (Google/Apple/Facebook) — guest — app+web — MVP
Profile completion — name/DOB/photo — guest — app+web — MVP
Login + login OTP — guest — app+web — MVP
Forgot/reset password (entry, sent, set-new) — guest — app+web — MVP
2FA setup + verify — guest — app+web — later
Account recovery — guest — app+web — later

## G2. Guest: home & explore
Home feed (logged-in; personalized) — guest — app+web — MVP
Home feed (logged-out) — guest — app+web — MVP
Featured destinations carousel — guest — app+web — MVP
Category browse (property types/themes) — guest — app+web — later
Seasonal/holiday inspiration — guest — app — later

## G3. Guest: search
Search input + autocomplete — guest — app+web — MVP
Date picker (range) — guest — app+web — MVP
Guest count picker (adults/children/infants) — guest — app+web — MVP
Filters (full sheet: price, type, amenities, instant-book, accessibility) — guest — app+web — MVP
Results list — guest — app+web — MVP
Results map (pins, clusters, search-this-area) — guest — app+web — MVP
No-results empty state — fold into results — MVP

## G4. Guest: listing detail
Listing detail (hero gallery, info, amenities, map, host card, reviews, policy, rules, booking bar) — guest — app+web — MVP
Full photo gallery (grid + full-screen swipe) — guest — app+web — MVP
All amenities sheet — guest — app+web — MVP
All reviews (list + sort) — guest — app+web — MVP
Host profile (full) — guest — app+web — MVP
Cancellation policy detail — guest — app+web — MVP
House rules detail — guest — app+web — MVP
Location/map expanded — guest — app+web — later
Report listing — guest — app+web — later
Share listing — guest — app+web — MVP

## G5. Guest: booking & checkout
Booking review (dates/guests confirm) — guest — app+web — MVP
Price breakdown — guest — app+web — MVP
Promo/gift-card entry — guest — app+web — MVP/later
Payment method list + add-new (card form) — guest — app+web — MVP
Wallet payments (platform-specific) — guest — app — later
Request-to-book message — guest — app+web — MVP
Booking confirmation (success) — guest — app+web — MVP
Booking pending (awaiting host) — guest — app+web — MVP
Booking declined — guest — app+web — MVP
Booking modification (dates/guests) — guest — app+web — later

## G6. Guest: trips
Trips list (upcoming/past) — guest — app+web — MVP
Trip detail (booking info, policy, host, check-in time) — guest — app+web — MVP
Check-in instructions — guest — app — MVP
Directions to property — guest — app — MVP
Checkout instructions — guest — app — later
Itinerary view — guest — app — later

## G7. Guest: messaging
Inbox (thread list) — guest — app+web — MVP
Conversation thread (+attachments) — guest — app+web — MVP
Message search — guest — app+web — later

## G8. Guest: wishlists
Wishlists overview — guest — app+web — MVP
Wishlist detail — guest — app+web — MVP
Create/edit wishlist — guest — app+web — MVP
Add-to-wishlist sheet — guest — app+web — MVP
Collaborative wishlist (invite/vote) — guest — app+web — later

## G9. Guest: reviews
Write review (ratings + text + private note) — guest — app+web — MVP
Review submitted confirmation — guest — app+web — MVP
View own reviews — guest — app+web — later

## G10. Guest: profile & settings
Public profile view/edit — guest — app+web — MVP
Verification center (email/phone/ID status) — guest — app+web — MVP
Settings hub — guest — app+web — MVP
Personal info — guest — app+web — MVP
Payments (saved methods) — guest — app+web — MVP
Currency + language selectors — guest — app+web — MVP
Notification preferences — guest — app+web — MVP
Privacy settings — guest — app+web — MVP
Security (password/2FA/devices) — guest — app+web — later
Data & privacy (export/delete account) — guest — app+web — later
Notifications center (in-app list) — guest — app — MVP

## G11. Guest: help & resolution
Help center (home/search/article) — guest — app+web — MVP
Contact support / submit ticket / ticket status — guest — app+web — MVP
Cancel booking flow (reason → refund calc → confirm) — guest — app+web — MVP
Resolution center (claims/disputes with host) — guest — app+web — later
Referral program + invite — guest — app+web — later
Gift cards — guest — app+web — later

## H1. Host: become-a-host + listing wizard
Become-a-host landing (value prop, earnings estimate) — host — web+app — MVP
Wizard: property type → location (map pin) → capacity (rooms/beds/baths/guests) → amenities → photos (upload/reorder/cover) → title → description → house rules → pricing (base/cleaning/extra-guest) → availability → publish preview → published success — host — app+web — MVP (each step a screen)
Payout method setup — host — app+web — MVP
Tax info capture — host — app+web — MVP

## H2. Host: dashboard & operations
Host dashboard/today (check-ins, messages, metrics) — host — app+web — MVP
Calendar (month view; price-per-date; block dates; min-stay) — host — app+web — MVP
Bulk price edit / weekly view — host — app+web — later
Listings manager (list + status) — host — app+web — MVP
Edit listing (per-section editors mirroring wizard) — host — app+web — MVP
Publish/unpublish/delete listing — host — app+web — MVP/later
Reservations list + detail — host — app+web — MVP
Accept/decline request (with reason) — host — app+web — MVP
Host inbox + thread (+ templates, scheduled messages) — host — app+web — MVP
Earnings dashboard (total, chart, per-booking breakdown) — host — app+web — MVP
Transactions/payout history — host — app+web — MVP
Payout methods manager — host — app+web — MVP
Tax documents — host — app+web — later
Reviews received + respond — host — app+web — MVP
Performance/insights (occupancy, rating summary) — host — app+web — MVP/later
Superhost status — host — app+web — later
Co-host management — host — app+web — later
Multi-listing/pro tools, dynamic pricing — host — web — later
Host help center — host — app+web — MVP

## S. States to fold IN-SCREEN (not separate rows)
Loading/skeleton, empty (no results/messages/trips/wishlists), network error, server error, payment
failed, offline banner, session expired. Plus app-level interstitials that ARE screens: force-update,
maintenance, account suspended/appeal, deep-link fallback, T&C/privacy consent, age gate.

## B. Booking.com differentiators (consider later)
Loyalty tier (Genius-like), property comparison, review-score filter, distance-to-landmark search.
