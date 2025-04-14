import { makeTemplate } from './lib/templates.mjs'

const netlifyVaryParseSetup = makeTemplate({
  request_headers: [
    ['Foo', '1'],
    ['Baz', '789']
  ],
  response_headers: [
    ['Cache-Control', 'max-age=5000'],
    ['Last-Modified', -3000],
    ['Date', 0]
  ],
  setup: true
})

const invalidDirectives = [
  'unknown-directive',
  'query=',
  'query=|',
  'query=|ab',
  'query=ab|',
  'header',
  'header=',
  'header=|',
  'header=@',
  'header=a b',
  'header=a|',
  'header=|a',
  'language',
  'language=',
  'language=1',
  'language=+',
  'language=|',
  'language=ab+',
  'language=+ab',
  'language=+ab+',
  'language=+ab+|',
  'language=ab|',
  'language=|ab',
  'language=ab|+',
  'language=e n',
  'language=+|ab',
  'country',
  'country=',
  'country=1',
  'country=+',
  'country=|',
  'country=ab+',
  'country=+ab',
  'country=+ab+',
  'country=+ab+|',
  'country=ab|',
  'country=|ab',
  'country=ab|+',
  'country=e n',
  'country=+|ab',
  'cookie',
  'cookie=',
  'cookie=|',
  'cookie=a|',
  'cookie=|a',
  'cookie=a b'

  // todo jwt and body
]

const validDirectives = [
  'query',
  'query=ab|a',
  'header=a|b',
  'language=en+es|ab',
  'country=en+es|ab',
  'cookie=a|b'
]

const tests = []

for (const invalidDirective of invalidDirectives) {
  tests.push({
    name: `HTTP cache must not reuse Netlify-Vary response with an invalid directive value of ${invalidDirective}`,
    id: `netlify-vary-syntax-invalid-${invalidDirective}`,
    depends_on: ['freshness-max-age'],
    requests: [
      netlifyVaryParseSetup({
        response_headers: [
          ['Netlify-Vary', `${invalidDirective}`, false]
        ]
      }),
      {
        request_headers: [
          ['Foo', '1'],
          ['Baz', '789']
        ],
        expected_type: 'not_cached'
      }
    ]
  })
  tests.push({
    name: `HTTP cache must not reuse Netlify-Vary response with an invalid directive value of ${invalidDirective} and an empty value`,
    id: `netlify-vary-syntax-invalid-${invalidDirective}-empty`,
    depends_on: ['freshness-max-age'],
    requests: [
      netlifyVaryParseSetup({
        response_headers: [
          ['Netlify-Vary', `${invalidDirective}, `, false]
        ]
      }),
      {
        request_headers: [
          ['Foo', '1'],
          ['Baz', '789']
        ],
        expected_type: 'not_cached'
      }
    ]
  })
  tests.push({
    name: `HTTP cache must not reuse Netlify-Vary response with an invalid directive value of ${invalidDirective} and an empty value on different lines`,
    id: `netlify-vary-syntax-invalid-${invalidDirective}-empty-lines`,
    depends_on: ['freshness-max-age'],
    requests: [
      netlifyVaryParseSetup({
        response_headers: [
          ['Netlify-Vary', `${invalidDirective}`, false],
          ['Netlify-Vary', '', false]
        ]
      }),
      {
        request_headers: [
          ['Foo', '1'],
          ['Baz', '789']
        ],
        expected_type: 'not_cached'
      }
    ]
  })
  tests.push({
    name: `HTTP cache must not reuse Netlify-Vary response with an empty value and an invalid directive value of ${invalidDirective}`,
    id: `netlify-vary-syntax-invalid-empty-${invalidDirective}`,
    depends_on: ['freshness-max-age'],
    requests: [
      netlifyVaryParseSetup({
        response_headers: [
          ['Netlify-Vary', `, ${invalidDirective}`, false]
        ]
      }),
      {
        request_headers: [
          ['Foo', '1'],
          ['Baz', '789']
        ],
        expected_type: 'not_cached'
      }
    ]
  })
  tests.push({
    name: `HTTP cache must not reuse Netlify-Vary response with an empty value and an invalid directive value of ${invalidDirective} on different lines`,
    id: `netlify-vary-syntax-invalid-empty-${invalidDirective}-lines`,
    depends_on: ['freshness-max-age'],
    requests: [
      netlifyVaryParseSetup({
        response_headers: [
          ['Netlify-Vary', '', false],
          ['Netlify-Vary', `${invalidDirective}`, false]
        ]
      }),
      {
        request_headers: [
          ['Foo', '1'],
          ['Baz', '789']
        ],
        expected_type: 'not_cached'
      }
    ]
  })

  for (const validDirective of validDirectives) {
    tests.push({
      name: `HTTP cache must not reuse Netlify-Vary response with an invalid directive value of ${invalidDirective} and a valid directive value of ${validDirective}`,
      id: `netlify-vary-syntax-invalid-${invalidDirective}-${validDirective}`,
      depends_on: ['freshness-max-age'],
      requests: [
        netlifyVaryParseSetup({
          response_headers: [
            ['Netlify-Vary', `${invalidDirective}, ${validDirective}`, false]
          ]
        }),
        {
          request_headers: [
            ['Foo', '1'],
            ['Baz', '789']
          ],
          expected_type: 'not_cached'
        }
      ]
    })
    tests.push({
      name: `HTTP cache must not reuse Netlify-Vary response with an invalid directive value of ${invalidDirective} and a valid directive value of ${validDirective} on different lines`,
      id: `netlify-vary-syntax-invalid-${invalidDirective}-${validDirective}-lines`,
      depends_on: ['freshness-max-age'],
      requests: [
        netlifyVaryParseSetup({
          response_headers: [
            ['Netlify-Vary', `${invalidDirective}`, false],
            ['Netlify-Vary', `${validDirective}`, false]
          ]
        }),
        {
          request_headers: [
            ['Foo', '1'],
            ['Baz', '789']
          ],
          expected_type: 'not_cached'
        }
      ]
    })
    tests.push({
      name: `HTTP cache must not reuse Netlify-Vary response with a valid directive value of ${validDirective} and an invalid directive value of ${invalidDirective}`,
      id: `netlify-vary-syntax-invalid-${validDirective}-${invalidDirective}`,
      depends_on: ['freshness-max-age'],
      requests: [
        netlifyVaryParseSetup({
          response_headers: [
            ['Netlify-Vary', `${validDirective}, ${invalidDirective}`, false]
          ]
        }),
        {
          request_headers: [
            ['Foo', '1'],
            ['Baz', '789']
          ],
          expected_type: 'not_cached'
        }
      ]
    })
    tests.push({
      name: `HTTP cache must not reuse Netlify-Vary response with a valid directive value of ${validDirective} and an invalid directive value of ${invalidDirective} on different lines`,
      id: `netlify-vary-syntax-invalid-${validDirective}-${invalidDirective}-lines`,
      depends_on: ['freshness-max-age'],
      requests: [
        netlifyVaryParseSetup({
          response_headers: [
            ['Netlify-Vary', `${validDirective}`, false],
            ['Netlify-Vary', `${invalidDirective}`, false]
          ]
        }),
        {
          request_headers: [
            ['Foo', '1'],
            ['Baz', '789']
          ],
          expected_type: 'not_cached'
        }
      ]
    })
  }
}

export default {
  name: 'Netlify-Vary Parsing',
  id: 'netlify-vary-parse',
  description: 'These tests check how caches parse the `Netlify-Vary` response header.',
  tests
}
