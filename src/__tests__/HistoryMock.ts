interface HistoryMock {
    length: number;
    state: any;
    back: jest.Mock<any, any>;
    forward: jest.Mock<any, any>;
    go: jest.Mock<any, any>;
    pushState: jest.Mock<any, any>;
    replaceState: jest.Mock<any, any>;
}

class HistoryMock implements HistoryMock {
    length: number = 0;
    state: any = null;
    back: jest.Mock<any, any> = jest.fn();
    forward: jest.Mock<any, any> = jest.fn();
    go: jest.Mock<any, any> = jest.fn();
    pushState: jest.Mock<any, any> = jest.fn();
    replaceState: jest.Mock<any, any> = jest.fn();
}

export default HistoryMock;
