const RegionsExceptionMessages = {
    WILAYA_NOT_FOUND: {
        error: 'no wilaya found with the given code',
        code: 'REGIONS.WILAYA.NOT_FOUND',
    },

    NEGATIVE_WILAYA_CODE: {
        error: 'wilaya code should be > 0',
        code: 'REGIONS.WILAYA_CODE.CANNOT_BE_NEGATIVE',
    },

    NULL_WILAYA_CODE: {
        error: 'wilaya code cannot be 0',
        code: 'REGIONS.WILAYA_CODE.CANNOT_BE_ZERO',
    },

    EMPTY_WILAYA_NAME: {
        error: 'wilaya name cannot be empty',
        code: 'REGIONS.WILAYA_NAME.CANNOT_BE_EMPTY',
    },
} as const;

export { RegionsExceptionMessages };
