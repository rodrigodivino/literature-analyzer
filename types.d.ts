declare module "@orcid/bibtex-parse-js" {
  interface ParsedBibtex {
    citationKey: string,
    entryType: string,
    entryTags: Record<string, string>
  }
  
  function toJSON(input: string): ParsedBibtex[];
}

