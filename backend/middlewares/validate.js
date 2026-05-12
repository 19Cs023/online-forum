import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((issue) => `${issue.path.join('.')} is ${issue.message}`);
      return res.status(400).json({ error: 'Invalid data', details: errorMessages });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
