import React from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  align?: "left" | "center";
};

export default function SectionHeader({
  title,
  subtitle,
  icon,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={`${align === "center" ? "text-center" : "text-left"} mb-12`}
    >
      <div
        className={`flex items-center gap-2 ${
          align === "center" ? "justify-center" : ""
        } mb-2`}
      >
        {icon}
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
