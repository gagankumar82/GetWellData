import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class GetWellDataControl  implements ComponentFramework.StandardControl<HTMLElement, HTMLElement, IInputs, IOutputs> {
    /**
     * Empty constructor.
     */
    private _buttonElement: HTMLButtonElement;
    private _spinnerElement: HTMLDivElement;
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<any, IInputs>;
    private _notifyOutputChanged: () => void;

    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     */
    public init(
        context: ComponentFramework.Context<any, IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
       container.innerHTML = "";
this._context = context;
this._notifyOutputChanged = notifyOutputChanged;
this._container = container;

// Create the "Get Well Data" button (Evernote style)
this._buttonElement = document.createElement("button");
this._buttonElement.innerHTML = `<span style="font-weight: bold;">Get Well Data</span>`;

// Styling to match the Evernote-style green button
this._buttonElement.style.backgroundColor = "#00B140"; // Evernote green
this._buttonElement.style.color = "white";
this._buttonElement.style.fontWeight = "bold";
this._buttonElement.style.border = "1px solid #008f34";
this._buttonElement.style.borderRadius = "6px";
this._buttonElement.style.padding = "12px 24px";
this._buttonElement.style.cursor = "pointer";
this._buttonElement.style.fontSize = "16px";
this._buttonElement.style.textAlign = "center";
this._buttonElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
this._buttonElement.style.transition = "background-color 0.2s ease";
this._buttonElement.style.minWidth = "180px";

// Optional: add hover effect
this._buttonElement.onmouseover = () => {
    this._buttonElement.style.backgroundColor = "#009e36";
};
this._buttonElement.onmouseout = () => {
    this._buttonElement.style.backgroundColor = "#00B140";
};

this._buttonElement.addEventListener("click", () => this.onButtonClick());

container.appendChild(this._buttonElement);

// Spinner (optional visual)
this._spinnerElement = document.createElement("div");
this._spinnerElement.innerText = "Fetching well details, just a moment...";
this._spinnerElement.style.display = "none";
this._spinnerElement.style.marginTop = "10px";
this._spinnerElement.style.color = "#333";
container.appendChild(this._spinnerElement);

    }

    /**
     * Called when any value in the property bag has changed.
     */
    private _accountNumber: string = "";
    public updateView(context: ComponentFramework.Context<any, IInputs>): void {
        this._context = context;
    this._accountNumber = context.parameters.accountnumber?.raw || "";
    }

    /**
     * Called by the framework prior to a control receiving new data.
     */
    public getOutputs(): IOutputs {
        return {
            accountnumber: "" // Currently no input field to bind
        };
    }

  private onButtonClick(): void {
    const accountNumber = this._context.parameters.accountnumber?.raw;

    if (!accountNumber) {
        alert("Account Number is required.");
        return;
    }

    this._spinnerElement.innerHTML = `
        <img src="https://i.gifer.com/ZZ5H.gif" width="24" height="24" style="vertical-align:middle; margin-right:10px;" />
        Fetching well details, just a moment...
    `;
    this._spinnerElement.style.display = "block";

    const request: any = {
        AccountNumber: accountNumber,
        getMetadata: () => ({
            boundParameter: null,
            parameterTypes: {
                AccountNumber: { typeName: "Edm.String", structuralProperty: 1 }
            },
            operationType: 0,
            operationName: "crb98_GetWellData"
        })
    };

    (this._context.webAPI as any).execute(request)
        .then((response: any) => {
            if (response.ok) return response.json();
            return Promise.reject(response);
        })
        .then((data: any) => {
            console.log("Custom Action Success:", data);
        })
        .catch((error: any) => {
            console.error("Custom Action Failed:", error);
        })
        .finally(() => {
            this._spinnerElement.innerHTML = "Fetching well details, just a moment...";
            setTimeout(() => {
                this._spinnerElement.style.display = "none";
            }, 2000);
        });
}



    /**
     * Called when the control is to be removed from the DOM tree.
     */
    public destroy(): void {
        console.log("destroy");
    }
}
