import { it, expect } from 'vitest';

it('should work', (ctx) => {
  // prints name of the test
  console.log(ctx.task.name);
  expect(1).toBe(1);
});
