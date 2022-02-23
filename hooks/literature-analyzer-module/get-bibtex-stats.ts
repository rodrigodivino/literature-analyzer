import {ParsedBibtex} from "@orcid/bibtex-parse-js";
import {getStopWordStatus} from "./get-stopword-status";
import {descending, range} from "d3";

export const getBibtexStats = (bibtex: ParsedBibtex[]): BibTexStats => {
  const recentYearThreshold = new Date().getUTCFullYear() - 5;
  
  const bibtexData = bibtex.filter(paperEntry => paperEntry?.entryTags?.author)
      .map(paperEntry => {
        const processedTitle =  ((paperEntry.entryTags?.title))
            .replace(/[\W_]+/g, " ")
            .split(' ')
            .filter(w => w)
            .map(w => w.toLowerCase())
            .filter(w => !getStopWordStatus(w))
        
        const processedAbstract = ((paperEntry.entryTags?.abstract ?? ''))
            .replace(/[\W_]+/g, " ")
            .split(' ')
            .filter(w => w)
            .map(w => w.toLowerCase())
            .filter(w => !getStopWordStatus(w))
        
        const bodyOfText = [...processedTitle, ...processedAbstract]
            
        return {
          d: paperEntry,
          processedTitle: processedTitle.join(' '),
          processedAbstract: processedAbstract.join(' '),
          year: parseFloat(paperEntry.entryTags?.year ?? ''),
          bodyOfText
        }
      })
  
  const allKeywords: KeywordStats[] = bibtexData.flatMap(paperData => {
    return paperData.bodyOfText.flatMap((word, i) => {
      return range(0, 4).flatMap(n => {
        return {
          keyword: paperData.bodyOfText.slice(i, i + 2 + n).join(' '),
          totalOccurrences: 0,
          occurrencesInRecent: 0,
          occurrencesInSurveys: 0,
          occurrencesOverTime: []
        }
      })
    })
  }).filter(k => k.keyword.length > 3 && k.keyword.split(' ').length > 1)
  
  
  const rawKeywords = allKeywords.map(k => k.keyword)
  
  console.log("rawKeywords", rawKeywords);
  
  const keywords = allKeywords.filter((k, i) => {
    return rawKeywords.indexOf(k.keyword) === i;
  })
  
  console.log("bibtexData", bibtexData);
  
  
  for(let keyword of keywords) {
    for (let paperData of bibtexData) {
      const paddedTitle = ' ' + paperData.processedTitle + ' ';
      const paddedAbstract = ' ' +  paperData.processedAbstract + ' ';
      
      if(paddedTitle.includes(' ' + keyword.keyword + ' ') || paddedAbstract.includes(' ' + keyword.keyword  + ' ')) {
        keyword.totalOccurrences += 1;
        
        if(paperData.year >= recentYearThreshold) {
          keyword.occurrencesInRecent += 1;
        }
        
        if(paperData.processedTitle.includes('survey')) {
          keyword.occurrencesInSurveys += 1
        }
        
        const keywordYearRecord = keyword.occurrencesOverTime.find(t => t.year === paperData.year);
        
        if(keywordYearRecord) {
          keywordYearRecord.occurrences += 1;
        } else {
          keyword.occurrencesOverTime.push({year: paperData.year, occurrences: 1})
        }
      }
    }
  }
  
  keywords.sort((a,b) => descending(a.totalOccurrences, b.totalOccurrences))
  
  console.log("keywords", keywords);
  
  return {
    keywords: []
  };
};

export interface BibTexStats {
  keywords: KeywordStats[];
}

export interface KeywordStats {
  keyword: string;
  totalOccurrences: number
  occurrencesInRecent: number;
  occurrencesInSurveys: number;
  occurrencesOverTime: Array<{ year: number, occurrences: number }>;
}
