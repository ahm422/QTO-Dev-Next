# Admin dashboard guide

The dashboard is where you manage everything on the website. Address: **`https://qtodev.com/admin`**.

> 📷 **Screenshot:** Admin sign-in page

## Signing in

1. Go to `https://qtodev.com/admin`.
2. Enter your email and password (set up for you by a super admin).
3. You land on the **Dashboard** home page.

Notes:
- After 15 minutes of inactivity you may be asked to act again; the system usually renews your session silently. After about a week you will need to sign in again.
- Five wrong passwords in a row temporarily locks the account. Wait, or ask a super admin to help.
- Forgot your password? Use **"Forgot password"** on the sign-in page. You will get an email with a reset link (valid for a short time).
- **Sessions:** under your account menu you can see every device you are signed in on and sign them out. A super admin can also force you out of all devices.

## The layout

- **Left sidebar** — grouped links: **Main** (Dashboard), **Content** (all the editable sections + the submission inboxes), **Settings** (site settings, admin users, activity log).
- **Main area** — the list or form for whatever you clicked.
- What you see in the sidebar depends on your role (see below).

> 📷 **Screenshot:** Dashboard home with sidebar

## Dashboard home

Shows content counts, a recent-activity feed (who changed what), and an activity chart. It is an overview only — nothing to edit here.

## Roles — what each can do

| Role | Can do |
|------|--------|
| **Editor** | View content, and edit items where editing is allowed. Cannot create or delete. |
| **Admin** | Everything an editor does, **plus** create and delete content. |
| **Super admin** | Everything, **plus** add/remove dashboard users and see the full Activity Log. |
| **HR** | Access to the **Employees** area only. |

If you try to open something your role does not allow, you will see an "unauthorized" page.

## Content sections (the "Content" group)

Each section works the same way:

- A **list page** with all items, a search/filter box, a **"New"** button (if your role allows), and per-row **Edit** / **Delete**.
- Items can be **reordered** (drag, or an order number) — this controls the order visitors see.
- A **"Published"** switch on each item. Off = hidden from visitors, still visible to you.
- An **Edit form** with the item's fields. Some text fields are rich-text (bold, links, lists, headings, tables, colours). Image fields let you upload a picture or paste a link.
- **Save** applies the change; the public page refreshes itself within moments.

The sections:

| Section | Controls on the website |
|---------|-------------------------|
| **Services** | The services list and each service detail page |
| **Products** | The company's own products and their feature lists |
| **Process Steps** | The "how we work" stages (home and services pages) |
| **Featured Work** | The highlight reel / client logos on the home page |
| **Why Choose Us** | The selling-points section |
| **Stats** | The headline numbers |
| **Testimonials** | Client quotes |
| **Industries** | The sectors-served list |
| **Engagement Models** | The "ways to work with us" cards |
| **FAQs** | Questions and answers (home page and `/faqs`) |
| **Blog** | Articles / insights |
| **Technologies** | The technology/tool list shown around the site |
| **Projects** | The portfolio and each case-study page |
| **Work Values** | The values shown on the About page |
| **About** | The About page's sections (story, mission, etc.) |
| **Team** | Team / leadership members |
| **Jobs** | Career listings |
| **Contact Info** | Phone, email, address, social links |
| **Pages** | The heading, intro text, and call-to-action at the top of each page ("page sections") |
| **Employees** | Staff records and digital ID cards (HR + super admin only) |

## Submission inboxes

These are read-only lists of what visitors sent in. You cannot edit a submission, but you can open it, read the detail, and (for contact/requirements) send a reply email from within the dashboard.

| Inbox | Contains |
|-------|----------|
| **Contact Inbox** | Messages from the short contact form |
| **Requirements** | Answers from the "Get a quote" questionnaire |
| **Job Applications** | Career applications, with links to the résumé |

Every submission is also emailed to the team when it arrives.

## Settings group

| Item | Purpose | Who |
|------|---------|-----|
| **Site Settings** | Everyday global settings (site name, tagline, key links) | Admin+ |
| **Site Config (Advanced)** | Raw key/value settings — only touch if instructed | Admin+ |
| **Admin Users** | Add, edit, deactivate dashboard users; set their role | Super admin |
| **Activity Log** | A full record of every change: who, what, when | Super admin |

## Publishing a change — the mental model

1. Open the item, make your edit.
2. Make sure **Published** is on (if you want it live).
3. **Save.**
4. Open the public page in another tab and refresh — your change should be there. If not, wait a few seconds and refresh again.
5. If it still hasn't updated, tell a developer (there is a manual "refresh this page" tool they can run).

## Good habits

- Prepare big content with **Published off**, then flip it on when ready.
- Keep image files reasonably sized before uploading (large images slow the page).
- Write descriptive image "alt text" — it helps SEO and accessibility.
- Don't share your login. Ask for your own account.
- If you leave the company, tell a super admin to deactivate your account.
