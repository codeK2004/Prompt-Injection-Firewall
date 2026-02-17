import { useState } from "react";
import { analyzePrompt } from "../api";
import { Send, Trash2, ShieldCheck, Loader2 } from "lucide-react";

export default function PromptForm({ setResult }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null); // Clear previous result
    try {
      const result = await analyzePrompt(prompt);
      setResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setResult(null);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ position: 'relative' }}>
        <textarea
          className="input-base"
          rows="6"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to simulate an injection attack..."
          style={{
            minHeight: '150px',
            resize: 'vertical',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          {prompt.length} chars
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-ghost"
          disabled={!prompt && !loading}
        >
          <Trash2 size={16} />
          Clear
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !prompt.trim()}
          style={{ minWidth: '140px' }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <ShieldCheck size={18} />
              Scan Payload
            </>
          )}
        </button>
      </div>
    </form>
  );
}
