import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {createContext} from "react";
import {KeywordStats} from "../hooks/literature-analyzer-module/get-bibtex-stats";

const DataContext = createContext<KeywordStats[]>([]);


function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
