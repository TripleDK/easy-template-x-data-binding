import { DataBindingPluginContent } from ".";
export declare type PrimitiveTemplateContent = string | number | boolean;
export declare type PluginTemplateContent = DataBindingPluginContent;
export declare type ExtensionContent = PrimitiveTemplateContent | PluginTemplateContent;
export interface ExtensionData {
    [tagName: string]: ExtensionContent;
}
