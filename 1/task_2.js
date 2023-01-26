const sum = (item) => {
    let result = item;

    const f = (item) => {
        if (item === undefined) {
            return result;
        }
        result += item;
        return f;
    }

    return f;
}

console.log(sum(1)(2)(3)())