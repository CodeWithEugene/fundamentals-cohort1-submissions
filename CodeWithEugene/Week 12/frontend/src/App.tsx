import axios from 'axios';
import { useEffect, useState } from 'react';

type NotificationType = 'email' | 'sms' | 'push';

interface Job {
  _id: string;
  type: NotificationType;
  recipient: string;
  message: string;
  status: string;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
}

const POLL_INTERVAL_MS = 3000;

function App() {
  const [type, setType] = useState<NotificationType>('email');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  const loadJobs = async () => {
    try {
      const res = await axios.get<Job[]>('/api/notifications');
      setJobs(res.data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch jobs', err);
    }
  };

  useEffect(() => {
    void loadJobs();
    const id = setInterval(() => {
      void loadJobs();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await axios.post('/api/notifications', {
        type,
        recipient,
        message
      });

      setRecipient('');
      setMessage('');
      await loadJobs();
    } catch (err) {
      setError('Failed to create notification job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <header className="header">
        <h1>WaveCom Notification Dashboard</h1>
        <p>Create notification jobs and observe their delivery status.</p>
      </header>

      <main className="content">
        <section className="card">
          <h2>Create Notification</h2>
          <form onSubmit={handleSubmit} className="form">
            <label className="field">
              <span>Type</span>
              <select value={type} onChange={(e) => setType(e.target.value as NotificationType)}>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push</option>
              </select>
            </label>

            <label className="field">
              <span>Recipient</span>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="user@example.com or +15551234567"
                required
              />
            </label>

            <label className="field">
              <span>Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Notification content"
                rows={4}
                required
              />
            </label>

            {error && <p className="error">{error}</p>}

            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Send Notification'}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Recent Jobs</h2>
          <div className="jobs-table-wrapper">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Recipient</th>
                  <th>Status</th>
                  <th>Attempts</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td className="mono">{job._id.slice(-6)}</td>
                    <td>{job.type}</td>
                    <td>{job.recipient}</td>
                    <td>
                      <span className={`badge badge-${job.status}`}>{job.status}</span>
                    </td>
                    <td>
                      {job.attempts}/{job.maxAttempts}
                    </td>
                    <td>{new Date(job.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="empty">
                      No jobs yet. Create one using the form.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;


