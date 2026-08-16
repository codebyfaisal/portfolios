/**
 * Safe HTML Sanitizer Utility for dangerouslySetInnerHTML
 * Strips script tags, inline event handlers (onerror, onload, etc.), and javascript: URIs
 */
export const sanitizeHtml = (dirtyHtml) => {
  if (!dirtyHtml || typeof dirtyHtml !== "string") return "";

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(dirtyHtml, "text/html");

    // Remove dangerous elements
    const dangerousElements = doc.querySelectorAll(
      "script, object, embed, form",
    );
    dangerousElements.forEach((el) => el.remove());

    // Remove dangerous inline attributes (on* handlers and javascript: urls)
    const allElements = doc.querySelectorAll("*");
    allElements.forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const val = attr.value.toLowerCase().trim();
        if (
          name.startsWith("on") ||
          val.startsWith("javascript:") ||
          val.startsWith("data:text/html")
        ) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return doc.body.innerHTML;
  } catch (err) {
    console.error("Sanitization error:", err);
    return dirtyHtml.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      "",
    );
  }
};

export default sanitizeHtml;
