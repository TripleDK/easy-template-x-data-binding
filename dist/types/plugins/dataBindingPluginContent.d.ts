export interface DataBindingPluginContent {
    _type: string;
    value: any;
}
export declare const DataBindingPluginContent: {
    isPluginContent(content: any): content is DataBindingPluginContent;
};
