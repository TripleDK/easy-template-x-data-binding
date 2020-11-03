import { DataBindingTemplatePlugin } from "./dataBindingTemplatePlugin";
export declare class DataBindingDatePlugin extends DataBindingTemplatePlugin {
    readonly contentType = "date";
    convertToDataBindingValue(value: any): string;
}
