import type {NextPage} from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Table from "../components/literature-analyzer-module/table/table";
import {getBibtexStats, KeywordStats} from "../hooks/literature-analyzer-module/get-bibtex-stats";
import {useEffect, useRef, useState} from "react";
import {ParsedBibtex, toJSON} from "@orcid/bibtex-parse-js";


const Home: NextPage = () => {
  const [bibtexStats, setBibtexStats] = useState<KeywordStats[]>([]);
  const [fileIsLoading, setFileIsLoading] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!fileInputRef.current) {
      return;
    }
    fileInputRef.current.addEventListener("change", async () => {
      setFileIsLoading(true);
      
      const files = fileInputRef.current!.files!;
      
      const promises = [];
      
      for (let i = 0; i < files.length; i++) {
        promises.push(new Promise<ParsedBibtex[]>((resolve, reject) => {
          const file = files[i];
          const reader = new FileReader();
          reader.readAsText(file, 'utf-8');
          reader.onload = (event) => {
            const content = event.target?.result as string;
            resolve(toJSON(content));
          };
          reader.onerror = () => {
            reject('Error reading file');
          };
        }));
      }
      
      const parsedBibtexList = await Promise.all(promises);
      
      setTimeout(() => {
        const bibTexStates = getBibtexStats(parsedBibtexList.flat(1));
        setFileIsLoading(false);
        setBibtexStats(bibTexStates);
      }, 10);
      
      
    }, false);
  }, [fileInputRef]);
  
  const isReady = bibtexStats.length > 0;
  
  return (
      <div className={styles.container}>
        <Head>
          <title>Literature Analyzer</title>
          <meta name="description" content="An app to extract keywords from paper titles and plot statistics"/>
        </Head>
        
        <header className={`${styles.header} ${isReady ? '' : styles.headerFull}`}>
          <h1>Literature Analyzer</h1>
          <p>Upload bibtex files to see statistics about paper titles</p>
          <input multiple={true} ref={fileInputRef} type={'file'}/>
          <span className={styles.loadingMessage}>{fileIsLoading ? 'Loading...' : ''}</span>
        </header>
        
        {
          isReady &&
          <main className={styles.main}>
              <Table data={bibtexStats}/>
          </main>
        }
        
        
        <footer className={styles.footer}>
          <hr/>
          <b>App by:</b> Rodrigo Divino.
        </footer>
      </div>
  );
};

export default Home;
