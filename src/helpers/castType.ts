import {
    IntrospectionType,
    IntrospectionNonNullTypeRef,
    IntrospectionNamedTypeRef,
} from 'graphql';

export const castType = (
    value: any,
    type: IntrospectionType | IntrospectionNonNullTypeRef
) => {
    const realType = type.kind === 'NON_NULL' ? type.ofType : type;
    switch (
        `${realType.kind}:${(realType as IntrospectionNamedTypeRef).name}`
    ) {
        case 'SCALAR:Int':
            return Number(value);

        case 'SCALAR:String':
            return String(value);

        case 'SCALAR:Boolean':
            return Boolean(value);

        default:
            return value;
    }
};
