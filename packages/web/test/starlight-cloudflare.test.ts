import { expect, test } from "bun:test"

const base = new URL("../node_modules/@astrojs/starlight/dist/user-components/", import.meta.url)
const { processPanels } = await import(new URL("tabs-processor.js", base).href)
const { processSteps } = await import(new URL("steps-processor.js", base).href)
const { processFileTree } = await import(new URL("file-tree-processor.js", base).href)

test("Cloudflare tabs preserve labels, accessibility links, and hidden panels", () => {
  const result = processPanels(
    '<starlight-tab-item data-label="One"><p>First</p></starlight-tab-item><starlight-tab-item data-label="Two"><button>Second</button></starlight-tab-item>',
    3,
  )
  expect(result.panels.map((panel: { label: string }) => panel.label)).toEqual(["One", "Two"])
  expect(result.html).toContain('aria-labelledby="tab-3-0"')
  expect(result.html).toContain('role="tabpanel"')
  expect(result.html).toContain('id="tab-panel-3-1"')
  expect(result.html).toContain("hidden")
})

test("Cloudflare steps preserve list structure and starting number", () => {
  const result = processSteps('<ol start="3"><li>First</li><li>Second</li></ol>')
  expect(result.html).toContain('role="list"')
  expect(result.html).toContain("--sl-steps-start: 2")
  expect(result.html).toContain("<li>First</li>")
  expect(() => processSteps("<p>Invalid</p>")).toThrow("single ordered list")
})

test("Cloudflare file trees preserve filenames and SVG icon namespaces", () => {
  const result = processFileTree("<ul><li>src<ul><li>index.ts</li></ul></li></ul>", "Directory")
  expect(result).toContain("index.ts")
  expect(result).toContain("<svg")
  expect(result).toContain("<path")
  expect(result).toContain("Directory")
})
