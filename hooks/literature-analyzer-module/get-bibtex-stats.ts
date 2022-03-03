import {ParsedBibtex} from "@orcid/bibtex-parse-js";
import {getStopWordStatus} from "./get-stopword-status";
import {ascending, descending, extent, max, maxIndex, range} from "d3";

export const getBibtexStats = (bibtex: ParsedBibtex[]): KeywordStats[] => {
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
          occurrencesInSurveys: 0,
          occurrencesOverTime: range(minYear, maxYear + 1).map(year => ({year, occurrences: 0, rank: 0})),
          averageTrendStrength: 0
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
      .filter(keywordRecord => keywordRecord.totalOccurrences > Math.ceil(bibtex.length * 0.01))
      .sort((a,b) => descending(a.totalOccurrences, b.totalOccurrences))
  
  keywordStats.forEach(keywordStat => {
    keywordStat.occurrencesOverTime
        .sort((a,b) => ascending(a.occurrences, b.occurrences))
    
    
    keywordStat.occurrencesOverTime.forEach((occurrence, i) => {
      occurrence.rank = i + 1;
    })
    
    keywordStat.occurrencesOverTime
        .sort((a,b) => ascending(a.year, b.year))
  })
  
  keywordStats.forEach(keywordStat => {
    keywordStat.averageTrendStrength = 0;
    keywordStat.occurrencesOverTime.forEach((occurrence, i) => {
      keywordStat.averageTrendStrength += (i + 1) * occurrence.rank;
    })
  })
  
  console.log("keywordStats", keywordStats);
  
  return keywordStats
};

export interface KeywordStats {
  keyword: string;
  totalOccurrences: number
  occurrencesInSurveys: number;
  occurrencesOverTime: Array<{ year: number, occurrences: number, rank: number }>;
  averageTrendStrength: number;
}
