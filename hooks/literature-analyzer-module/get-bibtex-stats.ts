import {ParsedBibtex} from "@orcid/bibtex-parse-js";
import {getStopWordStatus} from "./get-stopword-status";
import {ascending, descending, extent, range, sum} from "d3";

export const getBibtexStats = (bibtex: ParsedBibtex[]): KeywordStats[] => {
  const [minYear, maxYear] = extent(
      bibtex,
      paperEntry => parseFloat(paperEntry.entryTags?.year ?? '')
  ) as [number, number];
  
  const bibtexData = bibtex.filter(paperEntry => paperEntry?.entryTags?.author)
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
  
  const allKeywordStats: KeywordStats[] = bibtexData.flatMap(paperData => {
    return paperData.titleWords.flatMap((word, i) => {
      return range(0, 5).flatMap(n => {
        const stat: KeywordStats = {
          keyword: paperData.titleWords.slice(i, i + 2 + n).join(' '),
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

  
  for (let keyword of uniqueKeywordStats) {
    for (let paperData of bibtexData) {
      const paddedTitle = ' ' + paperData.processedTitle + ' ';
      const paddedKeyword = ' ' + keyword.keyword + ' ';
      
      if (paddedTitle.includes(paddedKeyword)) {
        keyword.totalOccurrences += 1;
        keyword.totalOccurrencesTitles.push(paperData.originalTitle)
        
        
        if (paperData.processedTitle.includes('survey')) {
          keyword.occurrencesInSurveys += 1;
          keyword.occurrencesInSurveysTitles.push(paperData.originalTitle)
        }
        
        const keywordYearRecord = keyword.occurrencesOverTime.find(t => t.year === paperData.year);
        
        if (keywordYearRecord) {
          keywordYearRecord.occurrences += 1;
          keywordYearRecord.occurrencesTitles.push(paperData.originalTitle)
        }
      }
    }
  }
  
  const keywordStats = uniqueKeywordStats
      .filter(keywordRecord => keywordRecord.totalOccurrences > Math.ceil(bibtex.length * 0.01))
      .sort((a, b) => descending(a.totalOccurrences, b.totalOccurrences));
  
  keywordStats.forEach(keywordStat => {
    keywordStat.occurrencesOverTime
        .sort((a, b) => ascending(a.year, b.year));
  });
  
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
  
  console.log("keywordStats", keywordStats);
  
  return keywordStats;
};

export interface KeywordStats {
  keyword: string;
  totalOccurrences: number;
  totalOccurrencesTitles: string[];
  occurrencesInSurveys: number;
  occurrencesInSurveysTitles: string[];
  occurrencesOverTime: Array<{ year: number, occurrences: number, occurrencesTitles: string[]}>;
  averageTrendStrength: number;
}
