import { expect, test } from "bun:test"
import { GitLabDirectAccessClient } from "gitlab-ai-provider"

test("GitLab direct access validates and caches string-valued headers with Zod 4", async () => {
  let calls = 0
  const client = new GitLabDirectAccessClient({
    instanceUrl: "https://gitlab.test",
    getHeaders: () => ({ Authorization: "Bearer fixture" }),
    fetch: Object.assign(
      async () => {
        calls++
        return Response.json({ token: "fixture-token", headers: { "x-gitlab-token": "fixture" } })
      },
      { preconnect: fetch.preconnect },
    ),
  })
  expect(await client.getDirectAccessToken()).toEqual({
    token: "fixture-token",
    headers: { "x-gitlab-token": "fixture" },
  })
  expect(await client.getDirectAccessToken()).toEqual({
    token: "fixture-token",
    headers: { "x-gitlab-token": "fixture" },
  })
  expect(calls).toBe(1)
})

test("GitLab direct access rejects non-string header values", async () => {
  const client = new GitLabDirectAccessClient({
    instanceUrl: "https://gitlab.test",
    getHeaders: () => ({}),
    fetch: Object.assign(async () => Response.json({ token: "fixture-token", headers: { invalid: 123 } }), {
      preconnect: fetch.preconnect,
    }),
  })
  await expect(client.getDirectAccessToken()).rejects.toThrow("Failed to get direct access token")
})
