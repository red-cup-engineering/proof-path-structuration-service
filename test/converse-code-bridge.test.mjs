import assert from "node:assert/strict";
import test from "node:test";
import { candidateConverseCodeProofFromPpa as bridge } from "../src/converse-code-bridge.mts";
import { termKey, sanitizeSegment } from "../src/index.mts";

const cell = (subject, predicate, object) => ({ subject, predicate, object });
const pair = cell("urn:alice", "urn:teaches", "urn:bob");
const reversed = cell("urn:bob", "urn:teaches", "urn:alice");

test("PPA -> Code converse has exactly the original typed cells and canonical path", () => {
  const r = bridge({ context: [pair], source: pair, target: reversed });
  assert.equal(r.ok, true);
  assert.equal(r.structure.version, 1);
  assert.deepEqual(r.structure.predicateMaps, []);
  assert.deepEqual(r.structure.nodes.map(n => n.key), [termKey(pair), termKey(reversed)].sort());
  assert.deepEqual(r.structure.edges, [{ from: termKey(pair), generator: "converse", to: termKey(reversed) }]);
  assert.equal(r.sourceKey, termKey(pair));
  assert.equal(r.targetKey, termKey(reversed));
  assert.equal(r.path, sanitizeSegment(termKey(pair)) + "/converse/library/" + sanitizeSegment(termKey(reversed)));
  for (const node of r.structure.nodes) {
    assert.deepEqual(Object.keys(node.cell).sort(), ["object", "predicate", "subject"]);
    assert.equal(typeof node.cell.subject, "string");
    assert.equal(typeof node.cell.object, "string");
    assert(Object.isFrozen(node.cell));
  }
  assert.equal("id" in r, false, "NI creation belongs to Data/SEN, not PPA");
  assert.equal("witnessRoot" in r, false, "external source attestations cannot be minted");
});

test("Context and JSON key ordering do not change the candidate", () => {
  const context = [pair, cell("urn:eve", "urn:likes", "urn:cat"), reversed];
  const a = bridge({ context, source: pair, target: reversed });
  const b = bridge({
    context: [...context].reverse(),
    source: { object: "urn:bob", subject: "urn:alice", predicate: "urn:teaches" },
    target: reversed,
  });
  assert.deepEqual(a, b);
});

test("PPA projections cannot masquerade as Code's reflexive-cell projections", () => {
  for (const target of ["urn:alice", "urn:bob"])
    assert.deepEqual(bridge({ context: [pair], source: pair, target }),
      { ok: false, reason: "non-liftable-generator" });
});

test("PPA is-a specialization is entity-to-entity, not Code's predicate map", () => {
  const relation = cell("urn:child", "is-a", "urn:parent");
  assert.deepEqual(bridge({ context: [relation], source: "urn:parent", target: "urn:child" }),
    { ok: false, reason: "non-liftable-generator" });
});

test("A converse inverse is not fabricated without its original source cell", () => {
  assert.deepEqual(bridge({ context: [pair], source: reversed, target: pair }),
    { ok: false, reason: "unwitnessed-source" });
  assert.deepEqual(bridge({
    context: [pair], source: pair, target: cell("urn:unknown", "urn:teaches", "urn:alice")
  }), { ok: false, reason: "unearned-ppa-route" });
});

test("The identity coordinate has no manufactured generator edge", () => {
  const diagonal = cell("urn:s", "urn:p", "urn:s");
  const r = bridge({ context: [diagonal], source: diagonal, target: diagonal });
  assert.equal(r.ok, true);
  assert.deepEqual(r.structure.edges, []);
  assert.equal(r.sourceKey, r.targetKey);
});

test("No non-string, non-NFC or unpaired surrogate can cross Code's key boundary", () => {
  const nonstring = cell({ role: "s" }, "urn:p", "urn:o");
  assert.deepEqual(bridge({
    context: [nonstring], source: nonstring, target: cell("urn:o", "urn:p", { role: "s" })
  }), { ok: false, reason: "non-string-predication-cell" });
  for (const subject of ["e\u0301", "\ud800"]) {
    const source = cell(subject, "urn:p", "urn:o");
    assert.deepEqual(bridge({ context: [source], source, target: cell("urn:o", "urn:p", subject) }),
      { ok: false, reason: "noncanonical-code-coordinate" });
  }
});

test("Code profile and original source admission bounds refuse instead of truncating", () => {
  const large = cell("x".repeat(1100), "urn:p", "urn:o");
  assert.deepEqual(bridge({
    context: [large], source: large, target: cell("urn:o", "urn:p", "x".repeat(1100))
  }), { ok: false, reason: "noncanonical-code-coordinate" });
  assert.deepEqual(bridge({ context: Array.from({ length: 257 }, () => pair), source: pair, target: reversed }),
    { ok: false, reason: "invalid-context" });
});

test("Hostile pathname substrings never become traversal segments", () => {
  const source = cell("../../etc/passwd", "urn:p", "file://x");
  const r = bridge({
    context: [source], source, target: cell("file://x", "urn:p", "../../etc/passwd")
  });
  assert.equal(r.ok, true);
  assert.equal(r.path.includes("/../"), false);
  assert.equal(r.path.split("/").some(segment => segment === "." || segment === ".."), false);
});

test("Malformed context and cycles refuse before emitting a candidate", () => {
  assert.deepEqual(bridge({ context: [], source: pair, target: reversed }),
    { ok: false, reason: "invalid-context" });
  assert.deepEqual(bridge({
    context: [{ subject: "s", predicate: "p" }], source: pair, target: reversed
  }), { ok: false, reason: "invalid-context" });
  const cycle = { subject: "s", predicate: "p" };
  cycle.object = cycle;
  assert.deepEqual(bridge({ context: [cycle], source: cycle, target: cycle }),
    { ok: false, reason: "invalid-context" });
});
