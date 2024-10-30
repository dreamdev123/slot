import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href="/css/reset.css" />
          <link rel="stylesheet" href="/css/main.css" />
          <link rel="stylesheet" href="/css/orientation_utils.css" />
          <link rel="stylesheet" href="/css/ios_fullscreen.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
