import * as omnibox from 'omnibox';

declare var omnibox: {
    parse: (url: string) => OmniboxCore;
};

interface Query {
    [key: string]: string; 
}

interface OmniboxPathName {
    pathname?: string;
}

interface OmniboxCore {
    protocol?: string;
    host?: string;
    port?: string;
    hash?: string;
    query?: Query;
}

interface OmniboxFull extends OmniboxCore, OmniboxPathName {
    path?: string;
    hostname?: string;
    search?: string;
}

interface CustomOmniboxMap extends OmniboxCore {
    pathnames: string[];
}

module UrlPad {

    const map = (o: OmniboxFull): CustomOmniboxMap => {
        return {
            protocol: o.protocol,
            host: o.host,
            port: o.port,
            pathnames: o.pathname.split('/').filter(char => char),
            hash: o.hash,
            query: o.query
        };
    }

    const parse_querystrings = (qs: Query): string => {
        return Object.keys(qs)
            .map((key, index) => `<input type="text" value='${key}'><input type="text" value='${qs[key]}'><br/>`)
            .join('');
    }

    const parse_pathnames = (names: string[]): string => {
        return names.map((v, i) => `<label>Pathname#${i}</label><input type="text" value='${v}'><br/>`).join('');
    }

    export function parse(url: string): string {
        let o = map(omnibox.parse(url));

        return Object.keys(o)
        .filter((key, index) => o[key])
        .map((key, index) => {
            let value = o[key];
            switch (key) {
                case 'query':
                    return parse_querystrings(value);                
                case 'pathnames':
                    return parse_pathnames(value);
                default:
                    return `<label>${key}</label><input type="text" value='${value}'><br/>`;
            }
        })
        .join('');
    }

}

window["UrlPad"] = UrlPad;