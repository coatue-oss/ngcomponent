declare abstract class NgComponent<Props, State> {
    private __isFirstRender;
    protected state: State;
    props: Props;
    abstract render(props: Props, state: State): void;
    $onChanges(changes: {}): void;
    $onInit(): void;
    $postLink(): void;
    $onDestroy(): void;
    protected didPropsChange(newProps: Props, oldProps: Props): boolean;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillReceiveProps(props: Props): void;
    shouldComponentUpdate(newProps: Props, oldProps: Props): boolean;
    componentWillUpdate(props: Props, state: State): void;
    componentDidUpdate(props: Props, state: State): void;
    componentWillUnmount(): void;
}
export default NgComponent;
