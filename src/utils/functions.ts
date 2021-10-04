const last = <T>(arr: T[]) => {
    return arr[arr.length - 1];
}

const a = last([1,2,3,4]);
const b = last(['a', 'b', 'c']);

const getFullName = <T extends {firstName: string, lastName: string}>(obj : T) => {
    return {
        ...obj,
        fullName: obj.firstName + " " + obj.lastName,
    }
}

const person = {
    firstName: 'Sasha',
    lastName: 'Petrov',
    age: 25,
}
const personA = getFullName(person);

interface Tab<T>{
    id: string;
    title: string;
    data: T;
}

type NumberTab = Tab<number>;
type StringTab = Tab<string>;

export {};