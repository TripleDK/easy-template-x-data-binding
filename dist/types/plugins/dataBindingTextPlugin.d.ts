import { DataBindingTemplatePlugin } from "./dataBindingTemplatePlugin";
export declare class DataBindingTextPlugin extends DataBindingTemplatePlugin {
    readonly contentType = "text";
    convertToDataBindingValue(value: any): string;
}
