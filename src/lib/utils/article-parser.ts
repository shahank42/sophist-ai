export interface ContentSegment {
  heading: string;
  content: string;
  headingLevel: "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface Article {
  title: string;
  intro?: string;
  sections: ContentSegment[];
}

export function parseMarkdownArticle(markdown: string): Article {
  // Split the markdown into lines
  const lines = markdown.trim().split("\n");

  // Initialize the result object
  const article: Article = {
    title: "",
    sections: [],
  };

  let currentSection: ContentSegment | null = null;
  let currentContent: string[] = [];
  let introFound = false;
  let isTitleFound = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]; // Don't trim lines to preserve indentation for lists
    const trimmedLine = line.trim();

    // Handle title (first ## or ### heading)
    if (
      !isTitleFound &&
      (trimmedLine.startsWith("## ") || trimmedLine.startsWith("### "))
    ) {
      article.title = trimmedLine.replace(/^#+ /, "").trim();
      isTitleFound = true;
      continue;
    }

    // Handle section headings (## to ######)
    const headingMatch = trimmedLine.match(/^(#{2,6}) /);
    if (headingMatch) {
      // Save previous section if exists
      if (currentSection && currentContent.length > 0) {
        currentSection.content = currentContent.join("\n"); // Don't trim to preserve formatting
        article.sections.push(currentSection);
        currentContent = [];
      }

      // Determine heading level
      const headingLevel = `h${headingMatch[1].length}` as
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6";

      // Start new section
      currentSection = {
        heading: trimmedLine.slice(headingMatch[1].length + 1).trim(),
        content: "",
        headingLevel,
      };
      continue;
    }

    // Handle content
    if (currentSection) {
      // Add to current section - preserve all lines including empty ones
      // This is important for tables and lists formatting
      currentContent.push(line);
    } else if (
      !introFound &&
      trimmedLine !== "" &&
      !trimmedLine.startsWith("#")
    ) {
      // First paragraph (not a heading) before any section becomes the intro
      article.intro = trimmedLine;
      introFound = true;
    }
  }

  // Save the last section
  if (currentSection && currentContent.length > 0) {
    currentSection.content = currentContent.join("\n"); // Don't trim content to preserve formatting
    article.sections.push(currentSection);
  }

  // Clean up extra whitespace in each section while preserving table and list formatting
  article.sections.forEach((section) => {
    // Trim only leading and trailing whitespace from the whole content, not individual lines
    section.content = section.content.replace(/^\s+|\s+$/g, "");
  });

  return article;
}
