import { IntrospectionType } from "graphql";

export const sanitizeValue = (type: IntrospectionType, value: any) => {
    if (type.name === 'Int') {
        return parseInt(value, 10);
    }

    if (type.name === 'Float') {
        return parseFloat(value);
    }

    return value;
};
