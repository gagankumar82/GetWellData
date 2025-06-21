import { Console } from "console";
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class standardfield implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    /**
     * Empty constructor.
     */
    private _inputElement: HTMLInputElement;
    private _buttonElement: HTMLButtonElement;
    private _spinnerElement: HTMLDivElement;
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;

        // Input element to capture rpc_wellapi value
        this._inputElement = document.createElement("input");
        this._inputElement.type = "text";
        this._inputElement.value = context.parameters.rpc_wellapi.raw || "";
        this._inputElement.addEventListener("input", () => {
            this._notifyOutputChanged();
        });
        container.appendChild(this._inputElement);

        // Button element with search icon
        this._buttonElement = document.createElement("button");
        this._buttonElement.innerText = "\uD83D\uDD0D Get Well Data"; // magnifying glass icon
        this._buttonElement.addEventListener("click", () => this.onButtonClick());
        container.appendChild(this._buttonElement);

        // Spinner element shown during API call
        this._spinnerElement = document.createElement("div");
        this._spinnerElement.innerText = "Fetching well details, just a moment...";
        this._spinnerElement.style.display = "none";
        container.appendChild(this._spinnerElement);
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;
        if (this._inputElement) {
            this._inputElement.value = context.parameters.rpc_wellapi.raw || "";
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
       return {
           rpc_wellapi: this._inputElement ? this._inputElement.value : ""
       };
    }

    private onButtonClick(): void {
        if (!this._context || !this._inputElement) {
            return;
        }

        this._spinnerElement.style.display = "block";

        const request: any = {
            rpc_wellapi: this._inputElement.value,
            getMetadata: () => ({
                boundParameter: null,
                parameterTypes: {
                    rpc_wellapi: { typeName: "Edm.String", structuralProperty: 1 }
                },
                operationType: 0,
                operationName: "rpc_getWellDetails"
            })
        };

        (this._context.webAPI as any).execute(request)
            .then((response: any) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then((data: any) => {
                console.log("Action success", data);
            })
            .catch((error: any) => {
                console.error("Action failed", error);
            })
            .finally(() => {
                this._spinnerElement.style.display = "none";
            });
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
        console.log("destroy");
    }
}
