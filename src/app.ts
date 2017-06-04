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

    class FormBuilder {

        private template: string[] = [];
        private for: string = '';

        constructor(forClass?: string) {
            this.for = forClass;
            this.template.push('<div class="form-group">');
        }

        label(title: string) {
            this.template.push(`<label class="col-sm-2">${title}</label>`);
            return this;
        }

        input(value: string, id?: string, size: number = 10) {
            let id_att = id ? 'id="'+ id +'"' : '';
            this.template.push(`<div class="col-sm-${size}">
            <input ${id_att} spellcheck="false" type="text" class="form-control ${this.for}" value="${value}"></div>`);
            return this;
        }

        build() {
            this.template.push('</div>')
            return this.template.join('');
        }
    }

    export function parse(url: string): string {
        let o = map(omnibox.parse(url));

        return Object.keys(o)
            .filter((key, index) => o[key])
            .map((key, index) => {
                let value = o[key];
                switch (key) {
                    case 'query':
                        return Object.keys(value)
                            .map((key, index) => new FormBuilder('query').label(`Querystring #${index}`).input(key, '',  5).input(value[key], '', 5).build())
                            .join('');

                    case 'pathnames':
                        return value
                            .map((value, index) => new FormBuilder('path').label(`Pathname #${index}`).input(value).build())
                            .join('');

                    default:
                        return new FormBuilder().label(key).input(value, key).build();
                }
            })
            .join('');
    }

    export function make(o: CustomOmniboxMap): string {
        let querystrings = Object.keys(o.query)
            .map((key, index) => `${key}=${o.query[key]}`)
            .join('&'),
            paths = o.pathnames.join('/');
        
        return `${o.protocol}://${o.host}${o.port ? ':' + o.port : ''}/${paths}${querystrings ? '?' + querystrings : ''}${o.hash ? o.hash : ''}`;
    }

}

window["UrlPad"] = UrlPad;