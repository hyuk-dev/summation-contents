"use client";
import { Button, Paper, Typography } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/summation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      // 응답 상태 코드가 200인 경우에만 JSON 파싱
      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const data = await res.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("요약 실패:", error);
      // 실패한 경우 에러 메시지 처리
      setSummary("요약 실패: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col justify-center items-center min-h-[100vh]">
      <h1 className="text-2xl font-bold mb-4">Summation Contents</h1>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Insert URL"
        className="w-full p-2 border rounded mb-4"
      />

      <Button
        type="button"
        onClick={handleSummarize}
        variant="contained"
        loading={loading}
      >
        summarize
      </Button>

      {summary && (
        <Paper elevation={3} sx={{ p: 3, mt: 10 }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Typography variant="body1">{summary}</Typography>
        </Paper>
      )}
    </div>
  );
}
