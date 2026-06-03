import { Text } from "@react-email/components";

export type EmailFieldRow = { label: string; value: string };

type EmailFieldRowsProps = {
  rows: EmailFieldRow[];
};

export function EmailFieldRows({ rows }: EmailFieldRowsProps) {
  return (
    <>
      {rows.map((row) => (
        <Text key={row.label} style={field}>
          <strong>{row.label}:</strong> {row.value}
        </Text>
      ))}
    </>
  );
}

const field = {
  color: "#333333",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 10px",
};
