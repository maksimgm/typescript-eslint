import { noFormat } from '@typescript-eslint/rule-tester';

import rule from '../../../src/rules/prefer-optional-chain';
import { createRuleTesterWithTypes } from '../../RuleTester';

const ruleTester = createRuleTesterWithTypes();

ruleTester.run('prefer-optional-chain-if', rule, {
  assertionOptions: {
    requireData: true,
  },
  valid: [
    `
declare const foo: { bar(): void } | null;
if (foo) foo.bar();
    `,
    {
      code: `
declare const foo: { bar(): void } | null;
declare function baz(): void;
if (foo) foo.bar();
else baz();
      `,
      options: [{ ignoreIfStatements: false }],
    },
    {
      code: `
declare const foo: { bar(): void; baz(): void } | null;
if (foo) {
  foo.bar();
  foo.baz();
}
      `,
      options: [{ ignoreIfStatements: false }],
    },
    {
      code: `
declare const foo: { bar: number } | null;
if (foo) foo.bar = 1;
      `,
      options: [{ ignoreIfStatements: false }],
    },
    {
      code: `
declare const foo: { bar(): void } | null;
declare const other: { bar(): void };
if (foo) other.bar();
      `,
      options: [{ ignoreIfStatements: false }],
    },
    {
      code: `
declare const callback: (() => void) | undefined;
declare const callbacks: (() => void)[];
if (callback) callbacks.push(callback);
      `,
      options: [{ ignoreIfStatements: false }],
    },
    {
      code: `
declare const foo: { bar: { baz(): void } | null; qux(): void };
if (foo.bar) foo.qux();
      `,
      options: [{ ignoreIfStatements: false }],
    },
    {
      code: `
declare const foo: { bar(): void } | null;
if (foo !== null) foo.bar();
      `,
      options: [{ ignoreIfStatements: false }],
    },
    {
      code: `
declare const foo: { bar(): void } | null;
if (foo == null) foo.bar();
      `,
      options: [{ ignoreIfStatements: false }],
    },
    {
      code: `
declare const foo: { bar(): void } | null;
declare const other: { bar(): void } | null;
if (foo != other) foo.bar();
      `,
      options: [{ ignoreIfStatements: false }],
    },
    {
      code: `
declare const foo: false | { bar(): void };
if (foo) foo.bar();
      `,
      options: [{ ignoreIfStatements: false }],
    },
    {
      code: `
declare const foo: number | undefined;
if (foo) foo.toFixed();
      `,
      options: [{ checkNumber: false, ignoreIfStatements: false }],
    },
    {
      code: `
declare const foo: { bar(): void };
if (foo) foo.bar();
      `,
      options: [{ ignoreIfStatements: false, requireNullish: true }],
    },
  ],
  invalid: [
    {
      code: `
declare const foo: { bar(): void } | null;
if (foo) foo?.bar();
      `,
      errors: [
        {
          column: 1,
          endColumn: 21,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const foo: { bar(): void } | null;
foo?.bar();
      `,
    },
    {
      code: `
declare const foo: { bar: number } | null;
if (foo) foo.bar;
      `,
      errors: [
        {
          column: 1,
          endColumn: 18,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const foo: { bar: number } | null;
foo?.bar;
      `,
    },
    {
      code: `
declare const foo: { bar(): void } | null;
// call bar when there's a foo
if (foo) foo.bar();
      `,
      errors: [
        {
          column: 1,
          endColumn: 20,
          endLine: 4,
          line: 4,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const foo: { bar(): void } | null;
// call bar when there's a foo
foo?.bar();
      `,
    },
    {
      code: `
declare const foo: { bar(): void } | null;
if (foo) foo.bar();
      `,
      errors: [
        {
          column: 1,
          endColumn: 20,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const foo: { bar(): void } | null;
foo?.bar();
      `,
    },
    {
      code: `
declare const list: string[] | undefined;
declare const item: string;
if (list) {
  list.push(item);
}
      `,
      errors: [
        {
          column: 1,
          endColumn: 2,
          endLine: 6,
          line: 4,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const list: string[] | undefined;
declare const item: string;
list?.push(item);
      `,
    },
    {
      code: `
declare const callback: (() => void) | undefined;
if (callback) {
  callback();
}
      `,
      errors: [
        {
          column: 1,
          endColumn: 2,
          endLine: 5,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const callback: (() => void) | undefined;
callback?.();
      `,
    },
    {
      code: `
declare const foo: { bar(): void } | null;
if (foo != null) foo.bar();
      `,
      errors: [
        {
          column: 1,
          endColumn: 28,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const foo: { bar(): void } | null;
foo?.bar();
      `,
    },
    {
      code: `
declare const foo: { bar(): void } | undefined;
if (undefined != foo) foo.bar();
      `,
      errors: [
        {
          column: 1,
          endColumn: 33,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const foo: { bar(): void } | undefined;
foo?.bar();
      `,
    },
    {
      code: `
declare const foo: { bar: { baz(): void } | null };
if (foo.bar) foo.bar.baz();
      `,
      errors: [
        {
          column: 1,
          endColumn: 28,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const foo: { bar: { baz(): void } | null };
foo.bar?.baz();
      `,
    },
    {
      code: `
declare const foo: { bar(): void } | null;
if (foo) foo['bar']();
      `,
      errors: [
        {
          column: 1,
          endColumn: 23,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const foo: { bar(): void } | null;
foo?.['bar']();
      `,
    },
    {
      code: `
declare const fn: (<T>() => void) | undefined;
if (fn) fn<string>();
      `,
      errors: [
        {
          column: 1,
          endColumn: 22,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const fn: (<T>() => void) | undefined;
fn?.<string>();
      `,
    },
    {
      code: `
declare const foo: { bar?(): void } | null;
if (foo) foo.bar?.();
      `,
      errors: [
        {
          column: 1,
          endColumn: 22,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const foo: { bar?(): void } | null;
foo?.bar?.();
      `,
    },
    {
      code: `
declare const foo: { bar(): void } | null;
declare const other: boolean;
if (other) {
} else if (foo) foo.bar();
      `,
      errors: [
        {
          column: 8,
          endColumn: 27,
          endLine: 5,
          line: 5,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const foo: { bar(): void } | null;
declare const other: boolean;
if (other) {
} else foo?.bar();
      `,
    },
    {
      code: noFormat`
declare const foo: { bar(): void } | null;
if (foo) foo.bar()
      `,
      errors: [
        {
          column: 1,
          endColumn: 19,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: `
declare const foo: { bar(): void } | null;
foo?.bar()
      `,
    },
    {
      code: `
declare const foo: { bar(): void } | null;
if (foo) /* keep me */ foo.bar();
      `,
      errors: [
        {
          column: 1,
          endColumn: 34,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: null,
    },
    {
      code: noFormat`
declare const foo: { bar(): void } | null;
if (foo!) (foo!).bar();
      `,
      errors: [
        {
          column: 1,
          endColumn: 24,
          endLine: 3,
          line: 3,
          messageId: 'preferOptionalChain',
          suggestions: null,
        },
      ],
      options: [{ ignoreIfStatements: false }],
      output: null,
    },
  ],
});
