import { TemplateExtension, ScopeData, TemplateContext } from "easy-template-x";
import { DataBindingTemplatePlugin } from ".";
import { IMap } from "easy-template-x/dist/types/types";
export declare class DataBindingExtension extends TemplateExtension {
    readonly version: string;
    protected readonly pluginsLookup: IMap<DataBindingTemplatePlugin>;
    private maxXmlDepth;
    constructor(plugins: DataBindingTemplatePlugin[]);
    execute(data: ScopeData, context: TemplateContext): Promise<void>;
    private findNodes;
    private findNextNode;
    private isMatch;
    private updateNode;
}
