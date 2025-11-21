import type { HealthCheckResponse, Legacy, LegacyPayment, Transformed, TransformedPayment } from "@/type.d.ts";
import { healthCheck } from "@/services";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLegacyPayment, fetchTransformedPayment } from "@/services/index";
import LegacyPaymentCard from "@/components/LegacyPaymentCard";


export default function Home() {
  const [status, setStatus] = useState<HealthCheckResponse>({
    status: 'down',
    uptime: 0,
    version: 'unknown',
    timestamp: new Date().toISOString(),
    error: 'Health check failed',
  });
  const [legacyPayment, setLegacyPayment] = useState<Legacy | null>(null);
  const [transformedPayment, setTransformedPayment] = useState<Transformed | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const healthStatus = await healthCheck();
        setStatus(healthStatus);

        const legacy = await fetchLegacyPayment();
        setLegacyPayment(legacy);

        const transformed = await fetchTransformedPayment();
        setTransformedPayment(transformed);

      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome to the Payment Dashboard</h1>

      <div className="flex justify-center gap-4 mb-8">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Server Health Check</h2>
          <p><strong>Status:</strong> <span className={status.status === 'up' ? 'text-green-600' : 'text-red-600'}>{status.status.toUpperCase()}</span></p>
          <p><strong>Uptime:</strong> {status.uptime} seconds</p>
          <p><strong>Version:</strong> {status.version}</p>
          <p><strong>Timestamp:</strong> {new Date(status.timestamp).toLocaleString()}</p>
          {status.error && <p className="text-red-500"><strong>Error:</strong> {status.error}</p>}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <h2 className="text-xl font-semibold mb-2 text-center">Legacy Payment (V1)</h2>
          {legacyPayment && legacyPayment.data ? legacyPayment.data.map((payment: LegacyPayment) =>
            <LegacyPaymentCard payment={payment} />
          ) : (
            <p className="text-center">No legacy payment data available.</p>
          )}
        </div>

        <div className="w-full md:w-1/2 lg:w-1/3">
          <h2 className="text-xl font-semibold mb-2 text-center">Transformed Payment (V2)</h2>
          {transformedPayment && transformedPayment.data ? transformedPayment.data.map((transformedPayment: TransformedPayment) =>
            <div className="border border-gray-300 rounded-lg p-4 m-4 shadow-md bg-white max-w-xs mx-auto">
              <h3 className="text-lg font-semibold mb-2">Transformed Payment Details</h3>
              <p className="text-sm text-gray-700"><strong>ID:</strong> {transformedPayment.id || 'N/A'}</p>
              <p className="text-sm text-gray-700"><strong>Amount:</strong> {transformedPayment.amount !== undefined ? transformedPayment.amount.toFixed(2) : 'N/A'}</p>
              <p className="text-sm text-gray-700"><strong>Customer ID:</strong> {transformedPayment.customerId || 'N/A'}</p>
              <p className="text-sm text-gray-700"><strong>Customer Name:</strong> {transformedPayment.customerName || 'N/A'}</p>
              <p className="text-sm text-gray-700"><strong>Timestamp:</strong> {transformedPayment.timestamp ? new Date(transformedPayment.timestamp).toLocaleString() : 'N/A'}</p>
            </div>
          ) : (
            <p className="text-center">No transformed payment data available.</p>
          )}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link to="/some-other-page" className="text-blue-600 hover:underline">Go to another page</Link>
      </div>
    </div>
  );
}
