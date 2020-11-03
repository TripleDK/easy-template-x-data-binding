import { DataBindingTemplatePlugin } from "./dataBindingTemplatePlugin";
export declare class DataBindingBooleanPlugin extends DataBindingTemplatePlugin {
    readonly contentType = "boolean";
    convertToDataBindingValue(value: any): string;
}
