export const buildingMetadataSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'BuildingMetadata',
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
      address: {
        type: 'object'
      },
      amenities: {
        type: 'array'
      },
      floorplanURL: {
        type: 'string'
      },
      buildingType: {
        type: 'string'
      },
      status: {
        type: 'string'
      },
    },
  }