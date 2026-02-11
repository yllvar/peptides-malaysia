import '@testing-library/jest-dom';

// Mock window.open for WhatsApp redirect tests
Object.defineProperty(window, 'open', {
    value: vi.fn(),
    writable: true,
});

// Mock window.scrollTo for ScrollToTop component
Object.defineProperty(window, 'scrollTo', {
    value: vi.fn(),
    writable: true,
});

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
        removeItem: vi.fn((key: string) => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; }),
        get length() { return Object.keys(store).length; },
        key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Reset mocks between tests
afterEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
});
