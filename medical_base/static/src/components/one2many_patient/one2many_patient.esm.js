/** @odoo-module **/

import { makeContext } from "@web/core/context";
import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { X2ManyField, x2ManyField } from "@web/views/fields/x2many/x2many_field";

export class One2manyPatientField extends X2ManyField {
    setup() {
        super.setup();

        this.linkButtonText = _t("Add Existing Partner");

        this.actionService = useService("action");
    }

    async onAddLink({context} = {}) {
        const record = this.props.record;
        await record.save();
        const additionalContext = makeContext([
            this.props.context,
            context,
            {
                active_id: record.resId,
                active_model: record.resModel,
            },
        ]);
        this.actionService.doAction("medical_base.patient_partner_search_act_window", {
            additionalContext,
            onClose: async () => {
                await record.load();
                record.model.notify();
            },
        });
    }
}

One2manyPatientField.template = "medical_base.One2manyPatientField";

export const one2manyPatientField = {
    ...x2ManyField,
    component: One2manyPatientField,
};

registry.category("fields").add("one2many_patient", one2manyPatientField);
