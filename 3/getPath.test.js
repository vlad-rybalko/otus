
describe('getPath()', () => {
    // Тестирование существующего элемента с ID
    it('should return a unique CSS selector for an element with ID', () => {
        const element = document.createElement('div');
        element.id = 'my-element';

        const selector = getPath(element);
        expect(selector).toEqual('div#my-element');
    });

    // Тестирование существующего элемента с классами
    it('should return a unique CSS selector for an element with classes', () => {
        const element = document.createElement('div');
        element.classList.add('class1', 'class2', 'class3');

        const selector = getPath(element);
        expect(selector).toEqual('div.class1.class2.class3');
    });

    // Тестирование существующего элемента без ID и классов
    it('should return a unique CSS selector for an element without ID and classes', () => {
        const element = document.createElement('div');

        const selector = getPath(element);
        expect(selector).toEqual('div');
    });

    // Тестирование несуществующего элемента
    it('should return undefined for a non-existent element', () => {
        const element = null;

        const selector = getPath(element);
        expect(selector).toBeUndefined();
    });

    // Тестирование передачи неправильного типа аргумента
    it('should return undefined for an argument that is not an Element', () => {
        const element = 'not an element';

        const selector = getPath(element);
        expect(selector).toBeUndefined();
    });
});
