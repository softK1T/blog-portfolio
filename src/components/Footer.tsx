import React from "react";
import { Container } from "./Container";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <Container>
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-semibold">{siteConfig.name}</div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a className="hover:text-foreground" href={siteConfig.social.email}>
              Email
            </a>
            <a
              className="hover:text-foreground"
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="hover:text-foreground"
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2025 {siteConfig.name}. Built with Next.js, Firebase, and AWS S3
          </p>
        </div>
      </Container>
    </footer>
  );
}
