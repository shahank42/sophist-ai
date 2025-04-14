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
  let isFirstParagraph = true;
  let isTitleFound = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle title (first ## or ### heading)
    if (!isTitleFound && (line.startsWith("## ") || line.startsWith("### "))) {
      article.title = line.replace(/^#+ /, "").trim();
      isTitleFound = true;
      continue;
    }

    // Handle section headings (## to ######)
    const headingMatch = line.match(/^(#{2,6}) /);
    if (headingMatch) {
      // Save previous section if exists
      if (currentSection && currentContent.length > 0) {
        currentSection.content = currentContent.join("\n").trim();
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
        heading: line.slice(headingMatch[1].length + 1).trim(),
        content: "",
        headingLevel,
      };
      continue;
    }

    // Handle content
    if (line && currentSection) {
      currentContent.push(line);
    } else if (line && isFirstParagraph && !isTitleFound) {
      // Handle intro (first paragraph before any section)
      article.intro = line;
      isFirstParagraph = false;
    }
  }

  // Save the last section
  if (currentSection && currentContent.length > 0) {
    currentSection.content = currentContent.join("\n").trim();
    article.sections.push(currentSection);
  }

  return article;
}
