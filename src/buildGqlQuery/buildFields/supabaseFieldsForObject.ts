import { IntrospectionType, IntrospectionField, IntrospectionObjectType } from "graphql";
import { IntrospectionResult, IntrospectedResource } from "ra-data-graphql";

export const supabaseFieldsForObject = ({
    introspectionResults, resourceObject, typeObject, fields,
}: {
    introspectionResults: IntrospectionResult;
    resourceObject?: IntrospectedResource;
    typeObject?: IntrospectionType; //IntrospectionObjectType,
    fields: IntrospectionField[];
}) => {
    if (!(resourceObject || typeObject)) return { object: null, fields: fields };

    const type = resourceObject?.type || typeObject as IntrospectionObjectType | IntrospectionType; // as IntrospectionObjectType

    if (!type.name.endsWith('Connection')) return { object: resourceObject || typeObject, fields };

    const object = resourceObject ?
        introspectionResults.resources.find(r => r.type.name === type.name.replace('Connection', '')) as IntrospectedResource
        : introspectionResults.types.find(t => t.name === type.name.replace('Connection', '')) as IntrospectionType;

    return { object, fields: (resourceObject ? (object as IntrospectedResource).type.fields : (object as IntrospectionObjectType).fields) as IntrospectionField[] };
};
