import {ParsedBibtex} from "@orcid/bibtex-parse-js";
import {getStopWordStatus} from "./get-stopword-status";
import {ascending, descending, extent, max, range} from "d3";

export const getBibtexStats = (bibtex: ParsedBibtex[]): BibTexStats => {
  const recentYearThreshold = new Date().getUTCFullYear() - 5;
  
  const [minYear, maxYear] = extent(bibtex, paperEntry => parseFloat(paperEntry.entryTags?.year ?? '')) as [number, number];
  
  const bibtexData = bibtex.filter(paperEntry => paperEntry?.entryTags?.author)
      .map(paperEntry => {
        const titleWords =  ((paperEntry.entryTags?.title))
            .replace(/[\W_]+/g, " ")
            .split(' ')
            .filter(w => w)
            .map(w => w.toLowerCase())
            .filter(w => !getStopWordStatus(w))
            
        return {
          d: paperEntry,
          titleWords,
          processedTitle: titleWords.join(' '),
          year: parseFloat(paperEntry.entryTags?.year ?? ''),
        }
      })
  
  const allKeywordStats: KeywordStats[] = bibtexData.flatMap(paperData => {
    return paperData.titleWords.flatMap((word, i) => {
      return range(0, 5).flatMap(n => {
        const stat: KeywordStats = {
          keyword: paperData.titleWords.slice(i, i + 2 + n).join(' '),
          totalOccurrences: 0,
          occurrencesInRecent: 0,
          occurrencesInSurveys: 0,
          occurrencesOverTime: range(minYear, maxYear + 1).map(year => ({year, occurrences: 0}))
        }
        return stat;
      })
    })
  })
  
  
  const keywordArray = allKeywordStats.map(k => k.keyword)
  
  const uniqueKeywordStats = allKeywordStats.filter((k, i) => {
    return keywordArray.indexOf(k.keyword) === i;
  })
  
  
  for(let keyword of uniqueKeywordStats) {
    for (let paperData of bibtexData) {
      const paddedTitle = ' ' + paperData.processedTitle + ' ';
      const paddedKeyword = ' ' + keyword.keyword + ' ';
      
      if(paddedTitle.includes(paddedKeyword)) {
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
        }
      }
    }
  }
  
  
  const keywordStats = uniqueKeywordStats
      .filter(keywordRecord => keywordRecord.totalOccurrences > 1)
      .sort((a,b) => descending(a.totalOccurrences, b.totalOccurrences))
  
  keywordStats.forEach(keywordStat => {
    keywordStat.occurrencesOverTime
        .sort((a,b) => ascending(a.year, b.year))
  })
  
  return {
    keywords: keywordStats
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
