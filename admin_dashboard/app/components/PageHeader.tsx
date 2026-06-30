import { Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
}

// Renders the standard page-level heading. Theme h4 (fontWeight 700) applies automatically.
export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <Typography variant="h4" gutterBottom color="primary">
      {title}
    </Typography>
  );
}
