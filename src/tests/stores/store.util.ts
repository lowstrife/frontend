export function initializeLocalStorage(
	key: string,
	state: Record<string, unknown>
): void {
	localStorage.clear();
	localStorage.setItem(key, JSON.stringify(state));
}
