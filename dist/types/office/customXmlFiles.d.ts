import { XmlParser, XmlNode, Zip } from "easy-template-x";
export declare class CustomXmlFiles {
    private readonly zip;
    private readonly xmlParser;
    private static readonly itemFileRegEx;
    private loaded;
    private readonly files;
    constructor(zip: Zip, xmlParser: XmlParser);
    save(): Promise<void>;
    load(): Promise<Map<string, XmlNode>>;
}
