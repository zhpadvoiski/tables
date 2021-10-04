import { Children } from "react";

interface Props{
    name: string;
}

const HelloCompenent: React.FC<Props> = () => {
    return (
        <></>
    )
}

interface FormProps<T>{
    values: T;
    children: (values: T) => JSX.Element;
}

const Form = <T extends {}>({values, children} : FormProps<T>) => {
    return children(values);
}

const App: React.FC = () => {
    return (
        <Form values={{firstName: 'Eugene', lastName: 'Padvoiski'}}>
            {(values) => <div>{values.firstName} hello</div>}
        </Form>
    )
}

export {};