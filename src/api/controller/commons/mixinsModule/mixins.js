import serviceFunc from "../../../service";
let {mixins} = serviceFunc();

//mixins/source-modules使用
export function sourceModule(data, cb, error) {
    mixins(data).then((res) => {
        cb(res);
    }).catch((err) => {
        error(err);
    })
}