import { flag, dedupe } from 'flags/next';
import { LDContext } from '@flags-sdk/launchdarkly';
import { ldAdapter } from '@flags-sdk/launchdarkly';

import { Identify } from 'flags';
const identify = dedupe((async ({ headers, cookies }) => {
    return {
        key: 'test',
    };
}) satisfies Identify<LDContext>);

export const exampleFlag = flag<boolean, LDContext>({
    key: 'example-flag',
    identify,
    adapter: ldAdapter.variation(),
});
