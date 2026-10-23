// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// `react-ga4` ships ESM; mock it globally for Jest's CJS test runtime.
jest.mock('react-ga4', () => ({
	__esModule: true,
	default: {
		initialize: jest.fn(),
		event: jest.fn(),
		set: jest.fn(),
		ga: jest.fn(),
		send: jest.fn(),
	},
}));

class MockIntersectionObserver {
	constructor(callback, options = {}) {
		this.callback = callback;
		this.options = options;
	}

	observe = jest.fn();

	unobserve = jest.fn();

	disconnect = jest.fn();

	takeRecords = jest.fn(() => []);
}

Object.defineProperty(window, 'IntersectionObserver', {
	writable: true,
	configurable: true,
	value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
	writable: true,
	configurable: true,
	value: MockIntersectionObserver,
});



