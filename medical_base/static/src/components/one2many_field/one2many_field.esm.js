/** @odoo-module **/

import { makeContext } from "@web/core/context";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";

export class MedicalX2ManyField extends X2ManyField {
    setup() {
        super.setup();
        this.orm = useService("orm");
        this.action = useService("action");
        if (this.props.record_action) {
            const originalOpenRecord = this._openRecord.bind(this);
            this._openRecord = (params) => {
                if (!params?.record) {
                    return originalOpenRecord(params);
                }
                const context = makeContext([this.props.context, params.context]);
                return this.orm
                    .call(this.list.resModel, this.props.record_action, [[params.record.resId]], {
                        context,
                    })
                    .then((action) => this.action.doAction(action));
            };
        }
    }
}
MedicalX2ManyField.props = {
    ...X2ManyField.props,
    record_action: {type: String, optional: true},
};

export const medicalX2ManyField = {
    ...x2ManyField,
    component: MedicalX2ManyField,
    extractProps: (params, dynamicInfo) => {
        const props = x2ManyField.extractProps(params, dynamicInfo);
        return {
            ...props,
            record_action: params?.attrs?.options?.record_action,
        };
    },
};

registry.category("fields").add("medical_one2many", medicalX2ManyField);
