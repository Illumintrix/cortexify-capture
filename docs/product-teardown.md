# Cortexify product teardown - 2 September 2026

## Product in one line
Cortexify is a free, BYO-key personal knowledge workspace: links and PDF/DOCX files enter a unified library, Gemini summarizes/tags/categorizes them, collections and notes add structure, and a Copilot uses OpenRouter plus optional Parallel AI for chat and web research.

## Live product map checked
- Public landing: promise, use cases, BYO-key explanation, pricing/FAQ, login/sign-up.
- Auth: email/password plus Google, Notion and Twitter.
- Copilot home: streak, inbox, weekly read count, completion rate, file upload, project/collection scope, dictation, chat history.
- Library: links, documents, history, search, grid/list toggle, bulk actions, mark read/unread, collection routing, edit/delete/retry, fixed capture bar.
- Notes: note list, creation, rich-text editor path, delete, notes generated from Copilot.
- Collections: hierarchy, emoji, description, create/edit/delete, content/document membership and one note per collection.
- Settings: General profile/avatar/theme; API keys; account identities; toast notifications; password change and account deletion.
- AI setup: Gemini for saved-content processing, OpenRouter for Copilot, Parallel AI for web search/scraping; selectable model.
- Data/storage: Supabase auth and RLS-backed content, documents, notes, collections, join tables, conversations and storage buckets. Documents accept PDF/DOCX up to 25 MB.
- Mobile: responsive app code exists, but the fixed web capture flow still requires opening Cortexify.

## What works
- Sharp free/BYO-key positioning removes subscription friction and keeps cost control visible.
- A single library across links and files is easy to understand.
- AI output is useful at a glance: title, summary, category, tags and thumbnail.
- Hierarchical collections, @mentions and collection-scoped Copilot are stronger than flat bookmarking.
- Read state and dashboard stats aim at consumption, not only hoarding.

## Main gaps
1. Capture is the bottleneck. Users must copy a URL, switch tabs, paste, choose a collection and return. There is no live browser extension.
2. The 63-item inbox and 0 read this week show the classic read-later failure: saving works better than resurfacing.
3. Library search appears lexical; there is no visible semantic find, source-aware answer or saved filter.
4. Duplicate prevention is only surfaced after manual paste; batch tab intake is missing.
5. Processing requires users to procure and understand three third-party keys. This is powerful but a large activation burden.
6. Notifications are in-app toasts, not useful when asynchronous processing finishes after the user leaves.
7. No visible import/export flow, mobile share-sheet, collaboration or public sharing.
8. Trust needs work: the login screen claims "Used by 10,000+ thinkers" while the current product is free and early; substantiate it or remove it. The landing/footer/legal copy should also make the operator/entity clear.
9. Sensitive documents can receive AI-generated summaries in the card view. Add clearer privacy controls, local/redacted modes and safe-preview options.
10. Notes include low-signal AI artifacts and duplicate titles, so generation without curation can create a second clutter problem.

## PM call
Do not build a thin bookmark button. Build a capture-and-triage surface: duplicate-aware one-click save, collection routing, selected-text notes and batch tab capture now; add weekly resurfacing and a mobile share target next. The core job is "get this out of my browser without losing why it mattered."

## Extension built
Cortexify Capture implements the first release of that wedge. It uses the existing live product contract instead of creating a parallel backend, and it never reads a password or AI key.
