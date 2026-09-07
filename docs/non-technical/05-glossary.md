# Glossary

Plain-language definitions of words used in this documentation and the dashboard.

| Term | Meaning |
|------|---------|
| **Admin dashboard / admin area** | The private control panel at `qtodev.com/admin` where staff manage the website. |
| **Alt text** | A short written description of an image, used by screen readers and search engines. Always fill it in. |
| **Case study** | A detailed project page: the client, the problem, what was built, and the results. |
| **CMS (Content Management System)** | The part of the dashboard that lets non-developers change website content. This whole product is, in effect, a custom CMS. |
| **Content editor / editor** | A dashboard role that can change existing content but not create or delete it. |
| **Draft** | An item that exists in the dashboard but is not shown to visitors because "Published" is switched off. |
| **Engagement model** | A way a client can work with the company (fixed-price project, dedicated team, etc.), shown like pricing options on the site. |
| **Featured work** | The rotating highlights / client logos on the home page. |
| **Hero** | The large headline area at the very top of a page. |
| **Lead** | A potential customer who has contacted the company (via the contact form or the quote questionnaire). |
| **Order** | A number (or drag position) that decides the sequence items appear in on the website. Lower = earlier. |
| **Page section** | An editable block at the top of a page — its heading, intro text, and main button. Managed under "Pages". |
| **Portfolio** | The collection of past projects, shown at `qtodev.com/projects`. |
| **Publish / Published** | The on/off switch that decides whether visitors can see an item. |
| **Requirements** | The longer "Get a quote" questionnaire, and the dashboard inbox that stores its submissions. |
| **Rich text** | A text editor with formatting buttons (bold, links, headings, lists, tables). |
| **Role** | The permission level of a dashboard user: editor, admin, super admin, or HR. |
| **Session** | Your signed-in state on one device. Sessions expire after about a week, or when you sign out. |
| **Slug** | The end part of a web address, e.g. `web-development` in `qtodev.com/services/web-development`. Usually set automatically from the title. |
| **Super admin** | The highest dashboard role: full access, including managing users and the activity log. |
| **Testimonial** | A quote from a client, shown on the site. |
| **Work values** | The company values shown on the About page. |
| **Activity log / audit log** | The record of every change made in the dashboard — who, what, when. Visible to super admins. |
| **QR code** | The square barcode on an employee ID card; scanning it opens that employee's card page. |
| **CNIC** | Pakistan's national identity card number, stored on employee records. |

## Behind-the-scenes terms (you will rarely need these)

| Term | Meaning |
|------|---------|
| **Cloudflare** | The hosting platform the website runs on. Keeps the site fast worldwide. |
| **D1** | Cloudflare's database — where all the content and records are stored. |
| **R2** | Cloudflare's file storage — where uploaded images, employee photos, and PDFs live. |
| **Worker** | The running program on Cloudflare that serves the website. There are two: production (`qtodev.com`) and staging (a test copy). |
| **Staging** | A separate copy of the site used to test changes before they reach the public site. |
| **Deploy** | The act of putting a new version of the website live. Done by a developer. |
| **Environment variable / secret** | A setting or password the site needs to run, kept outside the code. Managed by a developer. |
| **Revalidate** | The site's way of refreshing a public page after content changes. Usually automatic. |
| **Rate limiting** | Automatic protection that blocks too many rapid requests (e.g. repeated failed logins). |
