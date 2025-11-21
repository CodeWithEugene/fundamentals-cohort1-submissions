import NodeCache from 'node-cache';
import { fetchLegacyPayments } from '../../util/axios';
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export async function getPaymentsCached() {
    const key = 'payments_v2';
    const cached = cache.get(key);
    if (cached) return cached;
    const legacy = await fetchLegacyPayments();
    cache.set(key, legacy);
    return legacy;
}
