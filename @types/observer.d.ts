export type TObserver = { handler: <T>(data: T) => void, type: string, code: number, }

export function ObserverEvent(): {
    registerEvent: (
        observer: { handler: <T>(data: T) => void; type: string }
    ) => number;
    dispareEvent: <T>(params: { data: T; type: string }) => void;
};