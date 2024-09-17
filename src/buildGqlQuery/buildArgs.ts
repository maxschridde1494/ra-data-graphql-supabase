import { IntrospectionField, ArgumentNode, VariableDefinitionNode } from "graphql";
import * as gqlTypes from 'graphql-ast-types-browser';
import { UPDATE, UPDATE_MANY, DELETE, DELETE_MANY, CREATE } from "react-admin";

import { getGqlType } from "../helpers/getGqlType";

export const buildArgs = (
    query: IntrospectionField,
    variables: any,
    raFetchMethod: string
): ArgumentNode[] => {
    if (query.args.length === 0) {
        return [];
    }

    const validVariables = Object.keys(variables).filter(
        k => typeof variables[k] !== 'undefined'
    );

    if (raFetchMethod === UPDATE || raFetchMethod === UPDATE_MANY) {
        validVariables.push('filter');
        validVariables.push('set');
        validVariables.push('atMost');
    } else if (raFetchMethod === DELETE || raFetchMethod === DELETE_MANY) {
        validVariables.push('filter');
        validVariables.push('atMost');
    } else if (raFetchMethod === CREATE) {
        validVariables.push('objects');
    } else {
        const { sortField, sortOrder, page, perPage } = variables;
        if (sortField && sortOrder) validVariables.push('orderBy');
        if (page && perPage) {
            validVariables.push('offset');
            validVariables.push('first');
        }
    }

    let args = query.args
        .filter(a => validVariables.includes(a.name))
        .reduce(
            (acc: any, arg) => [
                ...acc,
                gqlTypes.argument(
                    gqlTypes.name(query.name === 'node' ? 'nodeId' : arg.name),
                    gqlTypes.variable(gqlTypes.name(arg.name))
                ),
            ],
            []
        );

    return args;
};

export const buildApolloArgs = (
    query: IntrospectionField,
    variables: any,
    raFetchMethod: string
): VariableDefinitionNode[] => {
    if (query.args.length === 0) {
        return [];
    }

    const validVariables = Object.keys(variables).filter(
        k => typeof variables[k] !== 'undefined'
    );

    if (raFetchMethod === UPDATE || raFetchMethod === UPDATE_MANY) {
        validVariables.push('filter');
        validVariables.push('set');
        validVariables.push('atMost');
    } else if (raFetchMethod === CREATE) {
        validVariables.push('objects');
    } else if (raFetchMethod === DELETE || raFetchMethod === DELETE_MANY) {
        validVariables.push('filter');
        validVariables.push('atMost');
    } else {
        const { sortField, sortOrder, page, perPage } = variables;
        if (sortField && sortOrder) validVariables.push('orderBy');
        if (page && perPage) {
            validVariables.push('offset');
            validVariables.push('first');
        }
    }

    let args = query.args
        .filter(a => validVariables.includes(a.name))
        .reduce((acc: any, arg) => {
            return [
                ...acc,
                gqlTypes.variableDefinition(
                    gqlTypes.variable(gqlTypes.name(arg.name)),
                    getGqlType(arg.type)
                ),
            ];
        }, []);

    return args;
};
