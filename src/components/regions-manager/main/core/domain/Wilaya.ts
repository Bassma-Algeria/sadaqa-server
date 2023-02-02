import { WilayaName } from './WilayaName';
import { WilayaCode } from './WilayaCode';

class Wilaya {
    private readonly _name: WilayaName;
    private readonly _code: WilayaCode;
    private readonly _addedAt: Date;

    static Create(code: number, name: string) {
        return new Wilaya(new WilayaName(name), new WilayaCode(code), new Date());
    }

    static FromState(state: Wilaya['state']) {
        return new Wilaya(
            new WilayaName(state.name),
            new WilayaCode(state.code),
            new Date(state.addedAt),
        );
    }

    private constructor(name: WilayaName, code: WilayaCode, addedAt: Date) {
        this._name = name;
        this._code = code;
        this._addedAt = addedAt;
    }

    get name() {
        return this._name;
    }

    get code() {
        return this._code;
    }

    get addedAt() {
        return this._addedAt;
    }

    get state() {
        return {
            name: this._name.value(),
            code: this._code.value(),
            addedAt: this._addedAt,
        };
    }
}

export { Wilaya };
