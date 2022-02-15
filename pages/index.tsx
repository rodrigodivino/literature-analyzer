import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {toJSON} from '@orcid/bibtex-parse-js'
import Table from "../components/literature-analyzer-module/table/table";


const Home: NextPage = () => {
  const testBibTex = toJSON('');
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Literature Analyzer</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <main className={styles.main}>
        <Table data={testBibTex}/>
      </main>

      <footer className={styles.footer}>
        Footer
      </footer>
    </div>
  )
}

export default Home
