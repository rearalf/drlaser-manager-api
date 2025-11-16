import Joi from 'joi';

const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .required()
    .messages({
      'any.required': 'NODE_ENV is required',
      'any.only': 'NODE_ENV must be one of [development, production, test]',
    }),
  PORT: Joi.number().default(3000).messages({
    'number.base': 'PORT must be a number',
  }),
  MYSELF_HOST: Joi.string().uri().required().messages({
    'any.required': 'MYSELF_HOST is required',
    'string.uri': 'MYSELF_HOST must be a valid URI',
  }),

  ALLOWED_ORIGINS: Joi.string()
    .default('*')
    .custom((value: string, helpers: Joi.CustomHelpers) => {
      if (value === '*' || value === '') return value;

      const urls = value.split(',').map((url) => url.trim());
      for (const url of urls) {
        const { error } = Joi.string()
          .uri({ scheme: [/https?/] }) // acepta http/https
          .validate(url);
        if (error) {
          return helpers.error('any.invalid', {
            message: `Invalid URL: ${url}`,
          });
        }
      }
      return value;
    })
    .messages({
      'string.base': 'ALLOWED_ORIGINS must be a string',
    }),

  DB_HOST: Joi.string().hostname().required().messages({
    'any.required': 'DB_HOST is required',
    'string.hostname': 'DB_HOST must be a valid hostname',
  }),
  DB_PORT: Joi.number().default(5432).messages({
    'number.base': 'DB_PORT must be a number',
  }),
  DB_USER: Joi.string().required().messages({
    'any.required': 'DB_USER is required',
  }),
  DB_PASSWORD: Joi.string().required().messages({
    'any.required': 'DB_PASSWORD is required',
  }),
  DB_NAME: Joi.string().required().messages({
    'any.required': 'DB_NAME is required',
  }),

  DB_TYPE: Joi.string()
    .valid('postgres', 'mysql', 'mariadb', 'sqlite', 'mssql')
    .default('postgres')
    .messages({
      'any.only':
        'DB_TYPE must be one of [postgres, mysql, mariadb, sqlite, mssql]',
    }),

  USER_EMAIL: Joi.string().email().required().messages({
    'any.required': 'USER_EMAIL is required',
    'string.email': 'USER_EMAIL must be a valid email address',
  }),

  USER_PASSWORD: Joi.string()
    .min(8)
    .pattern(new RegExp('(?=.*[A-Z])'))
    .pattern(new RegExp('(?=.*[a-z])'))
    .pattern(new RegExp('(?=.*[0-9])'))
    .pattern(new RegExp('(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'any.required': 'USER_PASSWORD is required',
      'string.min': 'USER_PASSWORD must be at least 8 characters long',
      'string.pattern.base':
        'USER_PASSWORD must include uppercase, lowercase, number, and special character',
    }),
});

export default JoiValidationSchema;
