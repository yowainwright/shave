import { Opts } from './shave';
interface Plugin {
    fn: {
        shave: (maxHeight: number, opts?: Opts) => void;
    };
}
declare global {
    interface Window {
        $: Plugin;
        jQuery: Plugin;
        Zepto: Plugin;
    }
}
export {};
