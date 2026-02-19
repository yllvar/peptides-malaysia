# Implementation Guide: Order ID Hardening & Admin Pagination
**Date:** 2026-02-19  
**Scope:** Two targeted changes. No refactoring, no new dependencies.

---

## Issue 1: Non-Sequential Order IDs (P3)

### Problem
```typescript
// api/checkout/index.ts:55
const orderNumber = `EVO-${Date.now().toString().slice(-8)}`;
```
This produces sequential, guessable IDs like `EVO-38291042`, `EVO-38291107`. An attacker can enumerate valid order IDs and, via the WhatsApp bot, retrieve the associated shipping name.

### Risk Assessment
- **Current exposure:** Low (low volume).
- **Future exposure:** Grows linearly with order count. The WhatsApp bot returns customer names for valid order IDs.
- **Web tracking (`/track`):** Already mitigated — requires both order number AND phone number.

### Solution: Alphanumeric Random Suffix
Replace the timestamp slice with a cryptographically random alphanumeric string.

**Format:** `EVO-XXXXXXXX` (8 uppercase alphanumeric characters)  
**Collision space:** 36^8 = ~2.8 trillion combinations. At 1,000 orders/day, collision probability is negligible for years.

### Implementation

**File:** `api/checkout/index.ts`  
**Change:** Lines 55 only. One-line replacement.

```typescript
// BEFORE
const orderNumber = `EVO-${Date.now().toString().slice(-8)}`;

// AFTER
const orderNumber = `EVO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
```

`crypto.randomUUID()` is available natively in Node 19+ and all modern serverless runtimes (Vercel uses Node 20). It produces a v4 UUID like `f47ac10b-58cc-4372-a567-0e02b2c3d479`, from which we slice 8 hex characters and uppercase them.

**Result:** `EVO-F47AC10B` — not guessable, not sequential.

### Collision Handling
The `orderNumber` column has a `@unique` constraint in Prisma schema (line 105 of `schema.prisma`). If a collision occurs, Prisma throws a unique constraint violation. The existing `catch` block returns a 500 error, and the customer retries checkout.

**Do we need retry logic?** No. With 16^8 = ~4.3 billion hex combinations, collision probability at current volume is effectively zero. Add retry logic only if order volume exceeds 10,000/day.

### What NOT to Change
- **Order display logic** in `Orders.tsx`, `Dashboard.tsx`, `OrderHistory.tsx` — they all use `order.orderNumber` as a string. The new format is the same length and shape (`EVO-XXXXXXXX`), so no UI changes are needed.
- **WhatsApp bot queries** — the bot queries by `order_number` column. The format is irrelevant to its SQL.
- **ToyyibPay integration** — `billName` accepts any string up to 30 chars. No issue.
- **Guest tracking (`api/track.ts`)** — already requires phone + order number. No change needed.

### Testing
Update the one test that constructs order numbers to use the new format. No behavioral test changes needed since the format is still `EVO-{string}`.

```typescript
// Verify the generated order number matches expected pattern
expect(order.orderNumber).toMatch(/^EVO-[A-F0-9]{8}$/);
```

### Impact on Existing Orders
None. Existing orders keep their old `EVO-{timestamp}` numbers. New orders get random IDs. Both formats coexist without conflict.

---

## Issue 2: Admin Order Pagination

### Problem
```typescript
// api/admin/orders/index.ts:13
const orders = await prisma.order.findMany({
    include: { items: true, payment: true, user: { ... } },
    orderBy: { createdAt: 'desc' }
});
```
This loads **all** orders with all relations into memory. At 500+ orders with items and payments, response size and query time will degrade noticeably.

### Solution: Cursor-Based Pagination
Cursor-based pagination is simpler than offset-based for Prisma and avoids "skipping" issues when new orders arrive during browsing.

### API Changes

**File:** `api/admin/orders/index.ts` — `GET` handler only.

```typescript
export async function GET(request: Request) {
    try {
        const auth = await requireAdmin(request);
        if (!auth.authorized) return auth.errorResponse!;

        const url = new URL(request.url);
        const take = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
        const cursor = url.searchParams.get('cursor'); // order ID
        const status = url.searchParams.get('status');  // optional filter
        const search = url.searchParams.get('search');  // optional search

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { shippingName: { contains: search, mode: 'insensitive' } },
            ];
        }

        const orders = await prisma.order.findMany({
            where,
            take: take + 1, // Fetch one extra to determine if there's a next page
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            include: {
                items: true,
                payment: true,
                user: { select: { fullName: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        const hasMore = orders.length > take;
        const results = hasMore ? orders.slice(0, take) : orders;
        const nextCursor = hasMore ? results[results.length - 1].id : null;

        return Response.json({
            orders: results,
            nextCursor,
            hasMore
        });
    } catch (error: any) {
        console.error('Admin Orders Fetch Error:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
```

**Key design decisions:**
- Default page size: **20** orders. Max: **50**. Prevents abuse.
- `take + 1` trick: fetch one extra record to determine `hasMore` without a separate `count()` query.
- **Server-side search and filter**: Moves filtering from the client to the database, reducing payload size.
- **Backward compatible**: If no `limit`/`cursor` params are sent, returns the first 20 orders. Existing tests still work (they just get fewer results).

### Frontend Changes

**File:** `pages/admin/Orders.tsx`

The component currently stores all orders in `useState<Order[]>([])` and filters client-side.

**Required changes:**

1. **Replace client-side filter state with query params:**
```typescript
// Replace local filtering with server calls
const [orders, setOrders] = useState<Order[]>([]);
const [nextCursor, setNextCursor] = useState<string | null>(null);
const [hasMore, setHasMore] = useState(false);
const [loadingMore, setLoadingMore] = useState(false);
```

2. **Update `fetchOrders` to accept params:**
```typescript
const fetchOrders = async (cursor?: string, append = false) => {
    if (!append) setLoading(true);
    else setLoadingMore(true);

    try {
        const params = new URLSearchParams();
        params.set('limit', '20');
        if (cursor) params.set('cursor', cursor);
        if (statusFilter !== 'all') params.set('status', statusFilter);
        if (searchTerm) params.set('search', searchTerm);

        const response = await fetch(`/api/admin/orders?${params}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        // ... error handling ...
        const data = await response.json();

        setOrders(prev => append ? [...prev, ...data.orders] : data.orders);
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
        setLoadingMore(false);
    }
};
```

3. **Debounce search input** (300ms) to avoid hammering the API on every keystroke:
```typescript
// Simple debounce (no new dependency)
useEffect(() => {
    const timer = setTimeout(() => {
        fetchOrders(); // Reset to first page on search/filter change
    }, 300);
    return () => clearTimeout(timer);
}, [searchTerm, statusFilter]);
```

4. **Add "Load More" button** at the bottom of the orders list:
```tsx
{hasMore && (
    <button
        onClick={() => fetchOrders(nextCursor!, true)}
        disabled={loadingMore}
        className="w-full py-3 bg-zinc-900 border border-zinc-800 rounded-xl 
                   text-sm font-bold text-gray-400 hover:text-white hover:bg-zinc-800 
                   transition-all mt-4"
    >
        {loadingMore ? 'Loading...' : 'Load More Orders'}
    </button>
)}
```

### What NOT to Change
- **Order detail panel** — stays the same. Clicking an order still shows its full details.
- **PATCH endpoint** — not paginated, operates on a single order. No change.
- **Dashboard analytics** — uses `api/admin/analytics`, not `api/admin/orders`. No change.
- **Guest tracking** — completely separate endpoint. No change.

### Testing Updates

**File:** `__tests__/api/admin_orders.test.ts`

Add one test for pagination behavior:
```typescript
it('should paginate results', async () => {
    const mockOrders = Array.from({ length: 25 }, (_, i) => ({
        id: `o${i}`, orderNumber: `EVO-${i}`, /* ... */
    }));
    
    vi.mocked(prisma.order.findMany).mockResolvedValueOnce(mockOrders.slice(0, 21));
    
    const token = await createToken('admin');
    const req = new Request('http://localhost/api/admin/orders?limit=20', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const res = await GET(req);
    const data = await res.json();
    
    expect(data.orders).toHaveLength(20);
    expect(data.hasMore).toBe(true);
    expect(data.nextCursor).toBe('o19');
});
```

**File:** `__tests__/pages/admin/Orders.test.tsx`

Update mock response format from array to paginated object:
```typescript
// BEFORE
fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => mockOrders
});

// AFTER
fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ orders: mockOrders, nextCursor: null, hasMore: false })
});
```

---

## Implementation Order

| Step | What | File(s) | Risk |
|------|------|---------|------|
| 1 | Random order IDs | `api/checkout/index.ts` | None — one line, backward compat |
| 2 | Add a test for new ID format | `__tests__/api/checkout.test.ts` | None |
| 3 | Server-side pagination (API) | `api/admin/orders/index.ts` | Low — test before deploying |
| 4 | Update order page (frontend) | `pages/admin/Orders.tsx` | Medium — test search + filter + load more |
| 5 | Update test mocks | `__tests__/api/admin_orders.test.ts`, `__tests__/pages/admin/Orders.test.tsx` | Low |

**Estimated total effort:** ~45 minutes of focused implementation.

---

## Verification Checklist
- [ ] New orders get `EVO-[A-F0-9]{8}` format
- [ ] Old orders (`EVO-{timestamp}`) still display and track correctly
- [ ] Admin orders page loads first 20 orders
- [ ] "Load More" fetches next page
- [ ] Search and status filter work server-side
- [ ] All existing tests pass after mock updates
- [ ] WhatsApp bot can still query new-format order numbers
