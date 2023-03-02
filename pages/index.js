import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [questionInput, setquestionInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      console.log(data.result);
      setResult(data.result);
      setquestionInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Kratos Speaks</title>
        <link rel="icon" href="/kratos_logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/kratos_logo.png" className={styles.icon} />
        <h3>Seek Kratos the God of War</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Speak quickly, mortal. I have little patience for idle chatter. What do you want?"
            value={questionInput}
            onChange={(e) => setquestionInput(e.target.value)}
          />
          <input type="submit" value="Respond to the Ghost of Sparta" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
