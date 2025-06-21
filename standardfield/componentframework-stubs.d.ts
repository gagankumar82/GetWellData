declare namespace ComponentFramework {
    namespace PropertyTypes {
        interface StringProperty {}
    }
    interface WebApi {}
    interface Context<T> {
        parameters: any;
        webAPI: WebApi;
    }
    interface Dictionary {}
    interface StandardControl<I,O> {
        init(context: Context<I>, notifyOutputChanged: () => void, state: Dictionary, container: HTMLDivElement): void;
    }
}
