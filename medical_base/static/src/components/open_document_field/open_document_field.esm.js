/** @odoo-module **/

import {Component} from "@odoo/owl";
import {registry} from "@web/core/registry";
import {useFileViewer} from "../file_viewer/file_viewer_hook.esm";
import {useService} from "@web/core/utils/hooks";
import {standardFieldProps} from "@web/views/fields/standard_field_props";

export class OpenDocumentViewerField extends Component {
    setup() {
        this.orm = useService("orm");
        this.fileViewer = useFileViewer();
    }
    async openDocument() {
        this.fileViewer.open(
            await this.orm.call(this.props.record.resModel, "open_document", [
                this.props.record.resId,
            ])
        );
    }
}

OpenDocumentViewerField.template = "medical_base.OpenDocumentViewerField";

OpenDocumentViewerField.props = {
    ...standardFieldProps,
};

export const openDocumentViewerField = {
    component: OpenDocumentViewerField,
    supportedTypes: ["integer"],
};

registry.category("fields").add("open_document_viewer", openDocumentViewerField);
