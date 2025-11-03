import { useState } from "react";

function App() {
  const [output, setOutput] = useState("Click 'Send Requests' to start...");

  // Function to send a single request
  const sendRequest = async (i) => {
    const res = await fetch("http://localhost:3000/api/process-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: 40 }),
    });
    const data = await res.json();
    return { id: i, timeTaken: parseFloat(data.timeTaken) }; // store number
  };

  // Function to send 100 requests
  const sendRequests = async () => {
    setOutput("Sending 100 requests...\n");
    let completed = 0;
    let times = [];

    for (let i = 1; i <= 100; i++) {
      sendRequest(i).then((result) => {
        completed++;
        times.push(result.timeTaken);

        // show each request result
        setOutput((prev) => prev + `Request ${result.id}: ${result.timeTaken}s\n`);

        // when all 100 are done
        if (completed === 100) {
          // calculate average
          const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2);
          setOutput(
            (prev) =>
              prev +
              `\n✅ All 100 requests finished!\n📊 Average latency: ${avg}s`
          );
        }
      });
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Phase 1 Load Test</h1>
      <button onClick={sendRequests}>Send 100 Requests</button>
      <pre style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>{output}</pre>
    </div>
  );
}

export default App;
