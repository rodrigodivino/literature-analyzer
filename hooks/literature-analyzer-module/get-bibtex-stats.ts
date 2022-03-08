import {ParsedBibtex} from "@orcid/bibtex-parse-js";
import {getStopWordStatus} from "./get-stopword-status";
import {ascending, descending, extent, range, sum} from "d3";

export const getBibtexStats = (bibtex: ParsedBibtex[]): KeywordStats[] => {
  const [minYear, maxYear] = extent(
      bibtex,
      paperEntry => parseFloat(paperEntry.entryTags?.year ?? '')
  ) as [number, number];
  
  const a = performance.now();
  const bibtexData = bibtex
      .filter(paperEntry => paperEntry?.entryTags?.author)
      .map(paperEntry => {
        const titleWords = ((paperEntry.entryTags?.title))
            .replace(/[\W_]+/g, " ")
            .split(' ')
            .filter(w => w)
            .map(w => w.toLowerCase())
            .filter(w => !getStopWordStatus(w));
        
        return {
          d: paperEntry,
          titleWords,
          processedTitle: titleWords.join(' '),
          originalTitle: paperEntry?.entryTags?.title ?? '',
          year: parseFloat(paperEntry.entryTags?.year ?? '')
        };
      });
  const b = performance.now();
  
  console.log(`Pre-processed BibTex (${(b - a) / 1000}s)`);
  
  
  const allKeywordStats: KeywordStats[] = bibtexData.flatMap(paperData => {
    return paperData.titleWords.flatMap((word, i) => {
      return range(0, 3).flatMap(n => {
        const keyword = paperData.titleWords.slice(i, i + 1 + n).join(' ')
        const stat: KeywordStats = {
          keyword,
          totalOccurrences: 0,
          totalOccurrencesTitles: [],
          occurrencesInSurveys: 0,
          occurrencesInSurveysTitles: [],
          occurrencesOverTime: range(minYear, maxYear + 1).map(year => ({year, occurrences: 0, occurrencesTitles: []})),
          averageTrendStrength: 0
        };
        return stat;
      });
    });
  });
  
  
  const keywordArray = allKeywordStats.map(k => k.keyword);
  
  const uniqueKeywordStats = allKeywordStats.filter((k, i) => {
    return keywordArray.indexOf(k.keyword) === i;
  });
  
  const c = performance.now();
  
  
  console.log(`Created Keywords (${(c - b) / 1000}s)`);
  
  
  for (let keyword of uniqueKeywordStats) {
    for (let paperData of bibtexData) {
      const paddedTitle = ' ' + paperData.processedTitle + ' ';
      const paddedKeyword = ' ' + keyword.keyword + ' ';
      
      if (paddedTitle.includes(paddedKeyword)) {
        keyword.totalOccurrencesTitles.push(paperData.originalTitle);
        
        
        if (paperData.processedTitle.includes('survey')) {
          keyword.occurrencesInSurveysTitles.push(paperData.originalTitle);
        }
        
        const keywordYearRecord = keyword.occurrencesOverTime.find(t => t.year === paperData.year);
        
        if (keywordYearRecord) {
          keywordYearRecord.occurrencesTitles.push(paperData.originalTitle);
        }
      }
    }
  }
  
  const d = performance.now();
  console.log(`Assigned Paper Titles (${(d - c) / 1000}s)`);
  
  
  let keywordStats = uniqueKeywordStats
      .filter(keywordRecord => keywordRecord.totalOccurrencesTitles.length > Math.ceil(bibtex.length * 0.01))
      .sort((a, b) => descending(a.keyword.length, b.keyword.length));
  
  keywordStats.forEach(keywordStat => {
    keywordStat.occurrencesOverTime
        .sort((a, b) => ascending(a.year, b.year));
  });
  
  keywordStats.forEach(keyword => {
    const subKeywords = keyword.keyword.split(' ');
    const allPossibilities: string[] = [];
    
    for (let j = 0; j < subKeywords.length - 1; j++) {
      for (let i = 0; i < subKeywords.length - j; i++) {
        allPossibilities.push(subKeywords.slice(i, i + j + 1).join(' '));
      }
    }
    
    const matchingSubKeywords = allPossibilities.map(subKeyword => keywordStats.find(k => k.keyword === subKeyword))
        .filter(d => d) as KeywordStats[];
    
    matchingSubKeywords.forEach(matchingSubKeyword => {
      matchingSubKeyword.totalOccurrencesTitles =
          matchingSubKeyword.totalOccurrencesTitles.filter(title => !keyword.totalOccurrencesTitles.includes(title));
      matchingSubKeyword.occurrencesInSurveysTitles =
          matchingSubKeyword.occurrencesInSurveysTitles.filter(title => !keyword.occurrencesInSurveysTitles.includes(
              title));
      keyword.occurrencesOverTime.forEach(occurrence => {
        const matchingOccurrence = matchingSubKeyword.occurrencesOverTime.find(subKeywordOccurrence => subKeywordOccurrence.year ===
            occurrence.year);
        
        if (matchingOccurrence) {
          matchingOccurrence.occurrencesTitles =
              matchingOccurrence.occurrencesTitles.filter(title => !occurrence.occurrencesTitles.includes(title));
        }
      });
    });
  });
  
  
  keywordStats.forEach(keywordStat => {
    keywordStat.totalOccurrences = keywordStat.totalOccurrencesTitles.length;
    keywordStat.occurrencesInSurveys = keywordStat.occurrencesInSurveysTitles.length;
    keywordStat.occurrencesOverTime.forEach(occurrence => {
      occurrence.occurrences = occurrence.occurrencesTitles.length;
    });
  });
  
  const e = performance.now();
  console.log(`Remove redundant keyword count (${(e - d) / 1000}s)`);
  
  
  keywordStats = keywordStats
      .filter(keywordStat => keywordStat.totalOccurrences > 1)
      .sort((a, b) => descending(a.totalOccurrences, b.totalOccurrences));
  
  
  keywordStats.forEach(keywordStat => {
    let acc = 0;
    let target = keywordStat.totalOccurrences * 0.75;
    let i = -1;
    while (acc < target) {
      i++;
      acc += keywordStat.occurrencesOverTime[i].occurrences;
    }
    const year = keywordStat.occurrencesOverTime[i].year;
    const worksAfterBulk = sum(keywordStat.occurrencesOverTime.slice(i), o => o.occurrences);
    keywordStat.averageTrendStrength = year + (worksAfterBulk / 1000000);
  });
  
  
  const f = performance.now();
  console.log(`Calculate trend strength (${(f - e) / 1000}s)`);
  
  console.log('Complete:', keywordStats);
  
  return keywordStats;
};

export interface KeywordStats {
  keyword: string;
  totalOccurrences: number;
  totalOccurrencesTitles: string[];
  occurrencesInSurveys: number;
  occurrencesInSurveysTitles: string[];
  occurrencesOverTime: Array<{ year: number, occurrences: number, occurrencesTitles: string[] }>;
  averageTrendStrength: number;
}
