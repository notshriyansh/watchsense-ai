const WATCH_KEY = "cinemind_watch_state";
const MYLIST_KEY = "cinemind_mylist_state";

export const loadWatchState = () => {
  try {
    const data = localStorage.getItem(WATCH_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveWatchState = (state: any) => {
  try {
    localStorage.setItem(WATCH_KEY, JSON.stringify(state));
  } catch {}
};

export const loadMyListState = () => {
  try {
    const data = localStorage.getItem(MYLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveMyListState = (state: any) => {
  try {
    localStorage.setItem(MYLIST_KEY, JSON.stringify(state));
  } catch {}
};

export const clearPersistedData = () => {
  localStorage.removeItem(WATCH_KEY);
  localStorage.removeItem(MYLIST_KEY);
};
