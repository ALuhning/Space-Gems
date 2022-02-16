export const spaceMetadataSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'SpaceMetadata',
    type: 'object',
    properties: {
      tokenId: {
        type: 'string'
      },
      name: {
        type: 'string',
      },
      media: {
          type: 'array',
      },
      images: {
        type: 'array',
      },
      description: {
        type: 'string',
        title: 'text',
        maxLength: 4000,
      },
      copies: {
        type: 'string'
      },
      issuedAt: {
        type: 'number'
      },
      expiresAt: {
        type: 'number'
      },
      startsAt: {
        type: 'number'
      },
      updatedAt: {
        type: 'number'
      },
      extra: {
        type: 'string'
      },
      reference: {
        type: 'array'
      },
      location: {
        type: 'object'
      },
      building: {
        type: 'array'
      },
      characteristics: {
        type: 'array'
      },
      spaceType: {
        type: 'string'
      },
      capacity: {
        type: 'number'
      },
      floor: {
        type: 'number'
      },
      identifier: {
        type: 'string'
      },
      status: {
        type: 'string'
      },
    },
  }