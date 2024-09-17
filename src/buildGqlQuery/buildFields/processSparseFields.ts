import { IntrospectionField } from "graphql";

export type SparseField = string | { [k: string]: SparseField[] };
export type ExpandedSparseField = { linkedType?: string; fields: SparseField[] };
export type ProcessedFields = {
  resourceFields: IntrospectionField[];
  linkedSparseFields: ExpandedSparseField[];
};

export function processSparseFields(
    resourceFields: IntrospectionField[],
    sparseFields: SparseField[]): ProcessedFields & { resourceFields: readonly IntrospectionField[]; } {
    if (!sparseFields || sparseFields.length === 0)
        throw new Error(
            "Empty sparse fields. Specify at least one field or remove the 'sparseFields' param"
        );

    const permittedSparseFields: ProcessedFields = sparseFields.reduce(
        (permitted: ProcessedFields, sparseField: SparseField) => {
            let expandedSparseField: ExpandedSparseField;
            if (typeof sparseField == 'string')
                expandedSparseField = { fields: [sparseField] };
            else {
                const [linkedType, linkedSparseFields] = Object.entries(sparseField)[0];
                expandedSparseField = {
                    linkedType,
                    fields: linkedSparseFields,
                };
            }

            const availableField = resourceFields.find(
                resourceField => resourceField.name ===
                    (expandedSparseField.linkedType ||
                        expandedSparseField.fields[0])
            );

            if (availableField && expandedSparseField.linkedType) {
                permitted.linkedSparseFields.push(expandedSparseField);
                permitted.resourceFields.push(availableField);
            } else if (availableField)
                permitted.resourceFields.push(availableField);

            return permitted;
        },
        { resourceFields: [], linkedSparseFields: [] }
    ); // ensure the requested fields are available

    if (permittedSparseFields.resourceFields.length === 0 &&
        permittedSparseFields.linkedSparseFields.length === 0)
        throw new Error(
            "Requested sparse fields not found. Ensure sparse fields are available in the resource's type"
        );

    return permittedSparseFields;
}
