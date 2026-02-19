import ReactMarkdown from 'react-markdown';
import { CheckCircle2, AlertTriangle, XCircle, Terminal } from 'lucide-react';

export default function ResultCard({ result }) {
  if (!result) return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '300px',
      color: 'var(--text-muted)',
      border: '1px dashed var(--border)',
      borderRadius: 'var(--radius-md)'
    }}>
      <Terminal size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
      <p>Ready to analyze. Submit a prompt to view results.</p>
    </div>
  );

  const isBlocked = result.decision === "BLOCK";
  const theme = isBlocked ?
    { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)', border: 'var(--danger)' } :
    { color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)', border: 'var(--success)' };

  const Icon = isBlocked ? XCircle : CheckCircle2;

  // Calculate a mock percentage for the bar based on score (assuming score is 0-1 or high number)
  // If scores are arbitrary, we might need to normalize them. For now let's assume raw numbers.

  return (
    <div className="glass-panel" style={{
      padding: '0',
      overflow: 'hidden',
      borderColor: isBlocked ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'
    }}>
      {/* Header Status */}
      <div style={{
        padding: '1.5rem',
        background: isBlocked ?
          'linear-gradient(to right, rgba(239, 68, 68, 0.1), transparent)' :
          'linear-gradient(to right, rgba(16, 185, 129, 0.1), transparent)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            padding: '0.5rem',
            borderRadius: '50%',
            background: theme.bg,
            color: theme.color
          }}>
            <Icon size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
              {isBlocked ? 'Threat Detected' : 'Safe Request'}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {isBlocked ? 'Action: Request Blocked' : 'Action: Request Allowed'}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            Decision
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: theme.color }}>
            {result.decision}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1px',
        background: 'var(--border)'
      }}>
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Rule Engine Score</span>
            <span style={{ fontWeight: '600' }}>{result.rule_score}</span>
          </div>
          <div style={{ height: '4px', background: 'var(--bg-app)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(parseInt(result.rule_score) || 0, 100)}%`,
              height: '100%',
              background: 'var(--primary)'
            }} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Risk Assessment</span>
            <span style={{
              fontWeight: 'bold',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              background: result.decision === "BLOCK" ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: result.decision === "BLOCK" ? 'var(--danger)' : 'var(--success)',
              fontSize: '0.9rem'
            }}>
              {result.risk_label || (result.decision === "BLOCK" ? "MALICIOUS" : "SAFE")}
            </span>
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Based on Rule Score analysis.
          </div>
        </div>
      </div>

      {/* Response / Details */}
      <div style={{ padding: '1.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Analysis Details
        </h4>
        <div style={{
          background: 'var(--bg-app)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          color: 'var(--text-main)'
        }}>
          <ReactMarkdown>{result.response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}