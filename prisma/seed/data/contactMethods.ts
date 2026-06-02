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
    value: "+1 (555) 123-4567",
    subLabel: "Monday to Friday, 9am–5pm EST",
    icon: "phone",
    order: 1,
  },
  {
    type: "office",
    label: "Office",
    value: "123 Tech Street, San Francisco, CA 94105",
    subLabel: "Visit us for a personal meeting",
    icon: "location-dot",
    order: 2,
  },
] as const;
