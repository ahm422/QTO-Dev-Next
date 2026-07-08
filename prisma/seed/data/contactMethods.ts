/** Mirrors ContactDetailsSection inline data. */
export const contactMethods = [
  {
    type: "email",
    label: "Email",
    value: "hello@qtodev.com",
    subLabel: "We'll respond within 24 hours",
    icon: "envelope",
    order: 0,
  },
  {
    type: "phone",
    label: "Phone",
    value: "+92 312 1234567",
    subLabel: "Monday to Friday, 9am–6pm PKT",
    icon: "phone",
    order: 1,
  },
  {
    type: "office",
    label: "Office",
    value: "USA • UK • Saudi Arabia • Pakistan",
    subLabel: "Visit us for a personal meeting",
    icon: "location-dot",
    order: 2,
  },
] as const;
