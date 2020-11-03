import { TemplateCompiler, DocxParser, XmlParser, XmlNode, TemplatePlugin } from "easy-template-x";
import { DataBindingPluginContent } from "./dataBindingPluginContent";
export interface DataBindingPluginUtilities {
    compiler: TemplateCompiler;
    docxParser: DocxParser;
    xmlParser: XmlParser;
}
export declare abstract class DataBindingTemplatePlugin extends TemplatePlugin {
    abstract get contentType(): string;
    abstract convertToDataBindingValue(value: any): string;
    setNodeContents(node: XmlNode, content: DataBindingPluginContent): void | Promise<void>;
    setUtilities(utilities: DataBindingPluginUtilities): void;
    protected utilities: DataBindingPluginUtilities;
}
