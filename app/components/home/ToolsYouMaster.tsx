"use client";
import React, { useEffect, useState } from "react";
import "./ToolsYouMaster.css";
import { httpClient, UPLOADS_URL } from "../../utils/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TechStackHeading {
  _id: string;
  name: string;
}

interface TechStack {
  _id: string;
  techStackHeadingId: TechStackHeading | string;
  techStack: string;
  logoImg: string;
}

interface CategoryProps {
  label: string;
  tools: { label: string; icon: string }[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ToolsYouMaster() {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use httpClient (same pattern as CoursesGrid) — carries auth token automatically
        const [headingsRes, stacksRes] = await Promise.all([
          httpClient.get("/techstacks-heading"),
          httpClient.get("/techstacks"),
        ]);

        // Normalise heading response — supports { techStacks:[] }, { headings:[] }, { data:[] }
        const headingsData = headingsRes.data;
        const headings: TechStackHeading[] =
          headingsData.techStacks ||
          headingsData.headings ||
          headingsData.data ||
          [];

        // Normalise stacks response
        const stacksData = stacksRes.data;
        const stacks: TechStack[] =
          stacksData.techStacks ||
          stacksData.data ||
          [];

        // Group stacks under their heading
        const grouped: CategoryProps[] = headings.map((heading) => ({
          label: heading.name,
          tools: stacks
            .filter((stack) => {
              const headingId =
                typeof stack.techStackHeadingId === "object"
                  ? (stack.techStackHeadingId as TechStackHeading)._id
                  : stack.techStackHeadingId;
              return headingId === heading._id;
            })
            .map((stack) => ({
              label: stack.techStack,
              icon: `${UPLOADS_URL}/techstacks/${stack.logoImg}`,
            })),
        }));

        // Only show headings that actually have tools
        setCategories(grouped.filter((cat) => cat.tools.length > 0));
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load tech stacks.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ─── Shared header (reused across all states) ──────────────────────────────

  const SectionHeader = () => (
    <>
      <span className="tools-badge">Tools You Master</span>
      <h2 className="tools-heading">
        Industry-Grade <span>Tech Stack</span>
      </h2>
      <p className="tools-subtext">
        The exact same tools used by data engineers at top companies like Amazon, Google, and Microsoft.
      </p>
    </>
  );

  // ─── Loading state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <section className="tools-section">
        <SectionHeader />
        <div className="tools-skeleton">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-block">
              <div className="skeleton-label" />
              <div className="skeleton-chips">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="skeleton-chip" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ─── Error state ───────────────────────────────────────────────────────────

  if (error) {
    return (
      <section className="tools-section">
        <SectionHeader />
        <p className="tools-subtext tools-error">Unable to load tools: {error}</p>
      </section>
    );
  }

  // ─── Empty state ───────────────────────────────────────────────────────────

  if (categories.length === 0) {
    return (
      <section className="tools-section">
        <SectionHeader />
        <p className="tools-subtext">No tools have been added yet.</p>
      </section>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="tools-section">
      <SectionHeader />

      <div className="tools-categories">
        {categories.map((cat) => (
          <div key={cat.label} className="category-block">
            <div className="category-label">{cat.label}</div>
            <div className="chips-row">
              {cat.tools.map((tool) => (
                <div key={tool.label} className="chip">
                  <img
                    src={tool.icon}
                    alt={tool.label}
                    width={20}
                    height={20}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect width='20' height='20' rx='4' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-size='7' fill='%236b7280'%3E?%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                  {tool.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}