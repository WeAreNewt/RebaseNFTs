import { AppProps } from 'next/app'
import Head from 'next/head'

import '^@styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <title>Rebasing Rabbits</title>
      </Head>

      <Component {...pageProps} />
    </>
  )
}
