import {ParsedBibtex} from "@orcid/bibtex-parse-js";

export namespace DashboardTypes {
  export interface Props {
    data: ParsedBibtex[];
  }
}
