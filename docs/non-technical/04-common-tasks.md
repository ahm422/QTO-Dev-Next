# How-to: common tasks

Every recipe starts from the admin dashboard: **`https://qtodev.com/admin`**, signed in.

---

## Add a new product

1. Sidebar → **Products** → **New**.
2. Fill in:
   - **Title** and optional **subtitle**.
   - **Short description** (used in the list) and **description** (the full text).
   - **Status label** — e.g. "Live", "Beta", "Coming soon".
   - **Image** — upload a picture; add **alt text** describing it.
3. Add **features** — for each: a name, a short description, and optionally an icon.
4. Set **Order** if you want it in a particular position.
5. Turn **Published** on.
6. **Save.** Check `qtodev.com/products`.

> 📷 **Screenshot:** Product edit form

---

## Add or edit a service

1. Sidebar → **Services** → **New** (or **Edit** an existing one).
2. Fill in **Title**, **short description**, **description**, choose an **icon**, add an **image** + alt text.
3. **Features** — a simple bullet list shown on the service page.
4. **Technology tags** — the tools/tech shown for that service.
5. **Published** on → **Save.** Check `qtodev.com/services`.

---

## Publish a blog post

1. Sidebar → **Blog** → **New**.
2. **Title**, **excerpt** (the summary in the list), **category**, **author** (defaults to the team name).
3. **Cover image** + alt text.
4. Write the **content** in the rich-text editor (headings, bold, links, lists, images, tables).
5. Optional: **tags**, **read time**, **Featured** / **Headline** switches (these promote it on the blog page).
6. To go live now: turn **Published** on and **Save**.
   To schedule: set the **published date** in the future and turn Published on — it appears from that date. (Confirm exact scheduling behaviour with your developer.)
7. Check `qtodev.com/blogs`.

> 📷 **Screenshot:** Blog editor

---

## Add a team member

1. Sidebar → **Team** → **New**.
2. **Name**, **role**, short **bio**, **photo** (+ alt text), **LinkedIn** URL.
3. Tick **Founder** if they should appear in the founders group.
4. Set **Order** (this controls where they sit in the grid).
5. **Published** on → **Save.** Check `qtodev.com/about`.

---

## Add a testimonial

1. Sidebar → **Testimonials** → **New**.
2. **Client name**, **role**, **company**, the **quote**.
3. Optional: **avatar** image, **rating** (default 5).
4. **Published** on → **Save.**

---

## Post a job opening

1. Sidebar → **Jobs** → **New**.
2. **Title**, **department**, **location**, **type** (full-time, contract…), **description**.
3. **Requirements** and **nice to have** — one point per line.
4. Optional: **salary range**, an external **apply URL**, an **expiry date**.
5. **Published** on → **Save.** Check `qtodev.com/careers`.
6. Applications arrive by email and appear under **Job Applications**.

---

## Edit the text at the top of a page (hero / intro / call-to-action)

1. Sidebar → **Pages**.
2. Pick the section you want, e.g. `homepage.hero`, `services.page`.
3. Edit the heading, sub-text, and button label/link.
4. **Save.** Refresh the relevant public page.

---

## Update contact details or social links

1. Sidebar → **Contact Info**.
2. Edit the phone, email, address, or social entries (each has a label, value, and icon).
3. **Save.** These update the Contact page and the footer.

---

## Reorder a list (services, FAQs, team, etc.)

Open the section's list page and either **drag rows** into the order you want, or edit each item's **Order** number (lower = earlier). Save.

---

## Hide something without deleting it

Open the item and turn **Published** off, then **Save.** It disappears from the website but stays in the dashboard. Turn it back on any time.

---

## Read and reply to an enquiry

1. Sidebar → **Contact Inbox** (or **Requirements** for quote questionnaires).
2. Click a row to see the full message and the visitor's details.
3. Use the **reply** option to send an email back from within the dashboard.
   (Job applications are view-only; use the résumé link and reply from your normal email.)

---

## Add an employee and get their digital ID card  *(HR / super admin)*

1. Sidebar → **Employees** → **New**.
2. Fill in the details: name, employee code, designation, department, team, CNIC, contact info, emergency contact, joining date, blood group, and a **photo**.
3. **Save.** The system creates:
   - a private **ID card page** at `qtodev.com/employee/<id>`,
   - a **QR code** that links to it.
4. Use the **export PDF** option to produce a printable badge.
5. Share the card link or QR with the employee.

Tip: if QR codes ever point at the wrong web address, a developer needs to check one setting (`NEXT_PUBLIC_SITE_URL`) and re-run the QR refresh.

> 📷 **Screenshot:** Employee form and generated ID card

---

## Add a new dashboard user  *(super admin only)*

1. Sidebar → **Admin Users** → **New**.
2. Enter their **email**, a temporary **password**, and choose a **role**:
   - **Editor** — can edit existing content only.
   - **Admin** — can also create and delete content.
   - **Super admin** — full access including user management.
   - **HR** — Employees area only.
3. **Save.** Send them the temporary password and ask them to change it (via "Forgot password" or their account settings).

---

## Remove someone's access  *(super admin only)*

1. Sidebar → **Admin Users** → open the person.
2. Turn **Active** off (preferred — keeps their history) or delete the account.
3. Optionally use **force logout** to end their sessions immediately.

---

## Check who changed what  *(super admin only)*

Sidebar → **Activity Log**. Every create, edit, delete, and sign-in is listed with the person, the action, and the time. Filter by action if the list is long.

---

## Something looks wrong on the website after I saved

1. Wait 10–20 seconds and refresh the public page.
2. Re-open the item in the dashboard and confirm **Published** is on and the change was actually saved.
3. Still wrong → contact your developer. Note the page URL, what you changed, and roughly when.
