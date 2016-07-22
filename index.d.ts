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
    protected componentWillMount(): void;
    protected componentDidMount(): void;
    protected componentWillReceiveProps(props: Props): void;
    protected shouldComponentUpdate(newProps: Props, oldProps: Props): boolean;
    protected componentWillUpdate(props: Props, state: State): void;
    protected componentDidUpdate(props: Props, state: State): void;
    protected componentWillUnmount(): void;
}
export default NgComponent;
