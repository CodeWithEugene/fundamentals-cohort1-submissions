import NodeCache from 'node-cache';
import { fetchLegacyPayments } from '../../util/axios';
import { transformPayment } from '../../util/transform';
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export async function getPaymentsCached() {
    const key = 'payments_v2';
    const cached = cache.get(key);
    if (cached) return cached;
    const legacy = await fetchLegacyPayments();
    const transformed = legacy.map(transformPayment);
    cache.set(key, transformed);
    return transformed;
}
