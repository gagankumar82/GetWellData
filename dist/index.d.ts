import { IInputs, IOutputs } from "./generated/ManifestTypes";
export declare class GetWellDataControl implements ComponentFramework.StandardControl<HTMLElement, HTMLElement, IInputs, IOutputs> {
    /**
     * Empty constructor.
     */
    private _buttonElement;
    private _spinnerElement;
    private _container;
    private _context;
    private _notifyOutputChanged;
    constructor();
    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     */
    init(context: ComponentFramework.Context<any, IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void;
    /**
     * Called when any value in the property bag has changed.
     */
    private _accountNumber;
    updateView(context: ComponentFramework.Context<any, IInputs>): void;
    /**
     * Called by the framework prior to a control receiving new data.
     */
    getOutputs(): IOutputs;
    private onButtonClick;
    /**
     * Called when the control is to be removed from the DOM tree.
     */
    destroy(): void;
}
