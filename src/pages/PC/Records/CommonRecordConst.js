const FieldType = {
    image: 'image',
    input: 'input',
    imageArray: 'imageArray',
    table: 'table',
};
const InputType = {
    number: 'number',
    text: 'text',
}

class FieldTypeFormItem {
    constructor(type,label,name) {
        this.type = type;
        this.label = label;
        this.name = name;
    }
}

class FieldTypeInput extends FieldTypeFormItem {
    // label 显示出来的名称
    // name 提交服务器的名称
    constructor(label,name,inputType) {
        super(FieldType.input,label,name);
        this.inputType = inputType || InputType.text;
    }
}
class FieldTypeInputNumber extends FieldTypeInput {
    constructor(label,name) {
        super(label,name,InputType.number);
    }
}

class FieldTypeImage extends FieldTypeFormItem {
    // label 显示出来的名称
    // name 提交服务器的名称
    constructor(label,name,uploadPromise) {
        super(FieldType.image,label,name);
        this.uploadPromise = uploadPromise;
    }
}

class FieldTypeImageArray extends FieldTypeFormItem {
    // label 显示出来的名称
    // name 提交服务器的名称
    constructor(label,name,uploadPromise) {
        super(FieldType.imageArray,label,name);
        this.uploadPromise = uploadPromise;
    }
}

class FieldTable {
    static copyArray(arr) {
        return JSON.parse(JSON.stringify(arr));
    }
    // fields 多个字段 ， value 每个字段都是一个 json 字符串
    // fields = ['a','b']
    // values = ['[1,2,3]','[2,5,8]']
    constructor(itemLabel,labels,fields,values,types) {
        this.label = itemLabel;
        this.type = FieldType.table;
        this.name = fields.join('-');
        this.labels = labels;
        this.fields = fields;
        this.types = types || [];
        this.values = []
        if (this.types.length < labels.length) {
            for (let i = this.types.length;i < labels.length;i++) {
                this.types.push('string');
            }
        }
        this.setValue(values);
    }
    setValue(values) {
        this.values = values.map(_ => {
            if (_ && _ !== '') {
                return JSON.parse(_).map(_ => +_);
            } else {
                return [];
            }
        });
        if (this.values.length === 0) {
            this.labels.forEach(() => this.values.push([]));
        }
        return this;
    }
    toForm() {
        let obj = {};
        this.fields.forEach((f,ind) => {
            obj[f] = JSON.stringify(this.values[ind]);
        });
        return obj;
    }
    removeByIndex(ind) {
        this.values.map(_ => _.splice(ind,1));
    }
    insertOneRecord(valueArr) {
        valueArr.forEach((v,ind) => {
            this.values[ind].push(v);
        })
    }
    createEmpty() {
        return new FieldTable(
            this.label,
            FieldTable.copyArray(this.labels),
            FieldTable.copyArray(this.fields),
            FieldTable.copyArray([]),
            FieldTable.copyArray(this.types),
        )
    }
    createEmptyForm() {
        let obj = [];
        for (let i = 0;i < this.fields.length;i++) {
            if (this.types[i] === 'number') {
                obj.push(-1);
            } else {
                obj.push('');
            }
        }
        return obj;
    }
}

export {
    FieldType,
    FieldTypeInput,
    FieldTypeImageArray,
    FieldTypeImage,
    FieldTypeInputNumber,
    InputType,
    FieldTable
}
