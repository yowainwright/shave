export declare type Link = {
    [key: string]: string | number | boolean;
};
export declare type Opts = {
    character?: string;
    classname?: string;
    spaces?: boolean;
    charclassname?: string;
    link?: Link;
};
export default function shave(target: string | NodeList, maxHeight: number, opts?: Opts): void;
