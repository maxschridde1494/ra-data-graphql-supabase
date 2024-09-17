/* eslint-disable default-case */
import {
  IntrospectionField,
  IntrospectionInputObjectType,
  TypeKind,
} from 'graphql';
import {
  UPDATE,
  UPDATE_MANY,
} from 'ra-core';
import { IntrospectionResult, IntrospectedResource } from 'ra-data-graphql';

export const buildCreateUpdateVariables = (introspectionResults: IntrospectionResult) => (
  _resource: IntrospectedResource,
  raFetchMethod: string,
  queryType: IntrospectionField,
  args: any,
) => {
  let { id, ids, data, meta } = args;
  if (!meta && data.meta) {
      meta = data.meta;
      delete data.meta;
  }
  let variables: any = { meta };
  let dataType: { key: 'objects' | 'set', type: TypeKind.LIST | TypeKind.OBJECT }
  let inputType: IntrospectionInputObjectType;

  if (raFetchMethod === UPDATE || raFetchMethod === UPDATE_MANY) {
      dataType = { key: 'set', type: TypeKind.OBJECT };

      const updateInputTypeName = (queryType.args.find(a => a.name === dataType.key).type as any).ofType.name
      inputType = introspectionResults.types.find(t => t.name === updateInputTypeName) as IntrospectionInputObjectType;

      variables.filter = { id: raFetchMethod === UPDATE ? { eq: id } : { in: ids } }
      variables.atMost = raFetchMethod === UPDATE ? 1 : ids.length
  } else {
      dataType = { key: 'objects', type: TypeKind.LIST };

      const instertInputTypeName = (queryType.args.find(a => a.name === dataType.key).type as any).ofType.ofType.ofType.name // list type so doubly nested ofTypes
      inputType = introspectionResults.types.find(t => t.name === instertInputTypeName) as IntrospectionInputObjectType;
  }

  const sanitizedData = Object.keys(data).reduce(
      (acc, key) => {
          if (!inputType.inputFields.find(f => f.name === key)) {
              console.info(`Field ${key} is not available on type ${inputType.name}`);
              return acc;
          }
          if (Array.isArray(data[key])) {
              const arg = queryType.args.find(a => a.name === `${key}Ids`);

              if (arg) {
                  return {
                      ...acc,
                      [`${key}Ids`]: data[key].map(({ id }) => id),
                  };
              }
          }

          if (typeof data[key] === 'object') {
              const arg = queryType.args.find(a => a.name === `${key}Id`);

              if (arg) {
                  return {
                      ...acc,
                      [`${key}Id`]: data[key].id,
                  };
              }
          }

          return {
              ...acc,
              [key]: data[key],
          };
      },
      {}
  )

  variables[dataType.key] = sanitizedData;
  if (dataType.type === TypeKind.LIST) variables[dataType.key] = [variables[dataType.key]];

  return variables
}